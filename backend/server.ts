import 'dotenv/config';
import { db } from './db.js';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';
import multer from 'multer';
// @ts-ignore
import pdfParse from 'pdf-parse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic origin validator — reflects ANY origin to completely eliminate CORS errors
const isAllowedOrigin = (origin: string | undefined): boolean => {
  return !!origin; // Allow any origin that makes a request
};

// ─── BULLETPROOF CORS MIDDLEWARE ───────────────────────────────────────────────
// We use a custom middleware instead of the cors package to guarantee headers are 
// injected on every single response, including 500 errors and Better Auth routes,
// which is a common quirk in Vercel serverless functions.
app.use((req: Request, res: Response, next) => {
  const origin = req.headers.origin;
  
  // Always append headers if origin is allowed
  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  
  // Always allow credentials and common headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');

  // Intercept OPTIONS preflight requests immediately
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
});

// ─── BETTER AUTH ─────────────────────────────────────────────────────────────
// Must be mounted BEFORE express.json() to avoid body-parsing conflicts.
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

// ─── NOTES ───────────────────────────────────────────────────────────────────
app.get('/api/notes', async (req: Request, res: Response) => {
  const notes = await db!.collection('notes').find().sort({ createdAt: -1 }).toArray();
  res.json(notes);
});

app.post('/api/notes', async (req: Request, res: Response) => {
  const note = {
    id: Date.now().toString(),
    title: req.body.title || 'Untitled',
    content: req.body.content || '',
    bullets: req.body.bullets || [],
    createdAt: new Date().toISOString()
  };
  await db!.collection('notes').insertOne(note);
  res.status(201).json(note);
});

app.delete('/api/notes/:id', async (req: Request, res: Response) => {
  await db!.collection('notes').deleteOne({ id: req.params.id });
  res.json({ success: true });
});

// Notes Summarizer — rule-based bullet extraction
app.post('/api/notes/summarize', (req: Request, res: Response): any => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const sentences = text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 20);

  // Score sentences by word importance
  const wordFreq: Record<string, number> = {};
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'to', 'of', 'in', 'on', 'at', 'by', 'for', 'with', 'this', 'that', 'these', 'those', 'it', 'its', 'he', 'she', 'we', 'they', 'i', 'you', 'and', 'or', 'but', 'not', 'from', 'as', 'so', 'if', 'then', 'when', 'where', 'how', 'what', 'who']);
  words.forEach((w: string) => {
    if (w && !stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  const scored = sentences.map((s: string) => {
    const sWords = s.toLowerCase().split(/\W+/);
    const score = sWords.reduce((acc: number, w: string) => acc + (wordFreq[w] || 0), 0) / (sWords.length || 1);
    return { sentence: s, score };
  });

  const topN = Math.min(Math.ceil(sentences.length * 0.4) + 2, 8);
  const bullets = scored
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, topN)
    .sort((a: any, b: any) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map((s: any) => s.sentence.replace(/^[•\-\*]\s*/, ''));

  res.json({ bullets });
});

// PDF Upload setup
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/notes/summarize-pdf', upload.single('pdf'), async (req: Request, res: Response): Promise<any> => {
  if (!req.file) return res.status(400).json({ error: 'No PDF file uploaded' });

  try {
    const data = await pdfParse(req.file.buffer);
    const text = data.text;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from the PDF' });
    }

    const truncatedText = text.substring(0, 15000);

    const aiRes = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert tutor. Analyze the provided text and generate a comprehensive, step-by-step summary of the core concepts. Use Markdown format with clear headers, actionable bullet points, and numbered steps. Do not include introductory or concluding conversational filler. Just return the markdown.'
          },
          { role: 'user', content: truncatedText }
        ]
      })
    });

    if (!aiRes.ok) throw new Error('AI Service failed');
    const resultText = await aiRes.text();

    res.json({ result: resultText });
  } catch (error) {
    console.error('PDF Summarize Error:', error);
    res.status(500).json({ error: 'Failed to parse PDF or generate summary.' });
  }
});

// ─── STUDENT ──────────────────────────────────────────────────────────────────
app.get('/api/students', async (req: Request, res: Response) => {
  const students = await db!.collection('students').find().toArray();
  res.json(students);
});

app.get('/api/student', async (req: Request, res: Response): Promise<any> => {
  const session = await auth.api.getSession({ headers: req.headers as unknown as Headers });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });
  const student = await db!.collection('students').findOne({ id: session.user.id });
  // If no profile exists yet, return default data from their auth account
  res.json(student || { id: session.user.id, name: session.user.name, email: session.user.email });
});

app.put('/api/student', async (req: Request, res: Response): Promise<any> => {
  const session = await auth.api.getSession({ headers: req.headers as unknown as Headers });
  if (!session) return res.status(401).json({ error: 'Unauthorized' });

  await db!.collection('students').updateOne(
    { id: session.user.id },
    { $set: { ...req.body, id: session.user.id } },
    { upsert: true }
  );
  const student = await db!.collection('students').findOne({ id: session.user.id });
  res.json(student);
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/api/health', async (req: Request, res: Response) => {
  const health = await db!.collection('health').find().sort({ createdAt: -1 }).toArray();
  res.json(health);
});

app.post('/api/health', async (req: Request, res: Response) => {
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString().split('T')[0],
    water: req.body.water || 0,
    sleep: req.body.sleep || 0,
    mood: req.body.mood || 3,
    steps: req.body.steps || 0,
    exercise: req.body.exercise || 0,
    createdAt: new Date().toISOString()
  };

  await db!.collection('health').updateOne(
    { date: entry.date },
    { $set: entry },
    { upsert: true }
  );

  const updatedEntry = await db!.collection('health').findOne({ date: entry.date });
  res.status(201).json(updatedEntry);
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
app.get('/api/messages', async (req: Request, res: Response) => {
  const messages = await db!.collection('messages').find().sort({ createdAt: -1 }).toArray();
  res.json(messages);
});

app.post('/api/admin/messages', async (req: Request, res: Response) => {
  const msg = {
    id: Date.now().toString(),
    title: req.body.title || 'Announcement',
    content: req.body.content || '',
    createdAt: new Date().toISOString()
  };
  await db!.collection('messages').insertOne(msg);
  res.status(201).json(msg);
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────
app.post('/api/admin/login', async (req: Request, res: Response) => {
  const settings = await db!.collection('settings').findOne({ id: 'admin' });
  const adminPassword = settings?.adminPassword || 'admin123';
  if (req.body.password === adminPassword) {
    res.json({ success: true, token: 'admin-token-2024' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/students', async (req: Request, res: Response) => {
  const students = await db!.collection('students').find().toArray();
  res.json(students);
});

app.get('/api/admin/stats', async (req: Request, res: Response) => {
  const totalStudents = await db!.collection('students').countDocuments();
  const totalNotes = await db!.collection('notes').countDocuments();
  const totalHealthLogs = await db!.collection('health').countDocuments();
  const recentNotes = await db!.collection('notes').find().sort({ createdAt: -1 }).limit(5).toArray();
  const recentHealth = await db!.collection('health').find().sort({ createdAt: -1 }).limit(7).toArray();

  res.json({
    totalStudents,
    totalNotes,
    totalHealthLogs,
    recentNotes,
    recentHealth
  });
});

app.get('/api/admin/notes', async (req: Request, res: Response) => {
  const notes = await db!.collection('notes').find().sort({ createdAt: -1 }).toArray();
  res.json(notes);
});

app.delete('/api/admin/notes/:id', async (req: Request, res: Response) => {
  await db!.collection('notes').deleteOne({ id: req.params.id });
  res.json({ success: true });
});

app.get('/api/admin/health', async (req: Request, res: Response) => {
  const health = await db!.collection('health').find().sort({ createdAt: -1 }).toArray();
  res.json(health);
});

// ─── EMERGENCIES ─────────────────────────────────────────────────────────────
app.post('/api/emergencies', async (req: Request, res: Response) => {
  const event = {
    id: Date.now().toString(),
    studentName: req.body.studentName || 'Unknown',
    department: req.body.department || 'Unknown',
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    timestamp: new Date().toISOString()
  };
  await db!.collection('emergencies').insertOne(event);
  res.status(201).json(event);
});

app.get('/api/admin/emergencies', async (req: Request, res: Response) => {
  const emergencies = await db!.collection('emergencies').find().sort({ timestamp: -1 }).toArray();
  res.json(emergencies);
});

// ─── COMMUNITY BOARD ─────────────────────────────────────────────────────────
app.get('/api/community', async (req: Request, res: Response) => {
  const posts = await db!.collection('communityPosts').find().sort({ createdAt: -1 }).toArray();
  res.json(posts);
});

app.post('/api/community', async (req: Request, res: Response) => {
  const post = {
    id: Date.now().toString(),
    type: req.body.type || 'project',
    title: req.body.title || '',
    description: req.body.description || '',
    skills: req.body.skills || '',
    contact: req.body.contact || '',
    authorName: req.body.authorName || 'Anonymous',
    authorDept: req.body.authorDept || '',
    createdAt: new Date().toISOString()
  };
  await db!.collection('communityPosts').insertOne(post);
  res.status(201).json(post);
});

app.delete('/api/community/:id', async (req: Request, res: Response) => {
  await db!.collection('communityPosts').deleteOne({ id: req.params.id });
  res.json({ success: true });
});

// Global error handler for async errors
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('API Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Student Portal API running on http://localhost:${PORT}`);
  console.log(`🔐 Better Auth mounted at /api/auth/*`);
});
