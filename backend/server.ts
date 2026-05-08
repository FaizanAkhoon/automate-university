import { db } from './db.js';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3001",
  "http://localhost:3002",
  "http://localhost:3003",
  "https://automate-university-fke8.vercel.app",
  "https://automate-university-git-main-faizanakhoonsh-faizanbashir018.vercel.app",
  "https://automate-university.vercel.app"
];
// CORS — allow credentials so Better Auth cookies travel between origins
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// ─── BETTER AUTH ─────────────────────────────────────────────────────────────
// Must be mounted BEFORE express.json() to avoid body-parsing conflicts.
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

// ─── NOTES ───────────────────────────────────────────────────────────────────
app.get('/api/notes', async (req: Request, res: Response) => {
  const notes = await db.collection('notes').find().sort({ createdAt: -1 }).toArray();
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
  await db.collection('notes').insertOne(note);
  res.status(201).json(note);
});

app.delete('/api/notes/:id', async (req: Request, res: Response) => {
  await db.collection('notes').deleteOne({ id: req.params.id });
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

// ─── STUDENT ──────────────────────────────────────────────────────────────────
app.get('/api/students', async (req: Request, res: Response) => {
  const students = await db.collection('students').find().toArray();
  res.json(students);
});

app.get('/api/student', async (req: Request, res: Response) => {
  const student = await db.collection('students').findOne({ id: '1' });
  res.json(student || {});
});

app.put('/api/student', async (req: Request, res: Response) => {
  await db.collection('students').updateOne(
    { id: '1' },
    { $set: { ...req.body, id: '1' } },
    { upsert: true }
  );
  const student = await db.collection('students').findOne({ id: '1' });
  res.json(student);
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/api/health', async (req: Request, res: Response) => {
  const health = await db.collection('health').find().sort({ createdAt: -1 }).toArray();
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

  await db.collection('health').updateOne(
    { date: entry.date },
    { $set: entry },
    { upsert: true }
  );

  const updatedEntry = await db.collection('health').findOne({ date: entry.date });
  res.status(201).json(updatedEntry);
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
app.get('/api/messages', async (req: Request, res: Response) => {
  const messages = await db.collection('messages').find().sort({ createdAt: -1 }).toArray();
  res.json(messages);
});

app.post('/api/admin/messages', async (req: Request, res: Response) => {
  const msg = {
    id: Date.now().toString(),
    title: req.body.title || 'Announcement',
    content: req.body.content || '',
    createdAt: new Date().toISOString()
  };
  await db.collection('messages').insertOne(msg);
  res.status(201).json(msg);
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────
app.post('/api/admin/login', async (req: Request, res: Response) => {
  const settings = await db.collection('settings').findOne({ id: 'admin' });
  const adminPassword = settings?.adminPassword || 'admin123';
  if (req.body.password === adminPassword) {
    res.json({ success: true, token: 'admin-token-2024' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/students', async (req: Request, res: Response) => {
  const students = await db.collection('students').find().toArray();
  res.json(students);
});

app.get('/api/admin/stats', async (req: Request, res: Response) => {
  const totalStudents = await db.collection('students').countDocuments();
  const totalNotes = await db.collection('notes').countDocuments();
  const totalHealthLogs = await db.collection('health').countDocuments();
  const recentNotes = await db.collection('notes').find().sort({ createdAt: -1 }).limit(5).toArray();
  const recentHealth = await db.collection('health').find().sort({ createdAt: -1 }).limit(7).toArray();

  res.json({
    totalStudents,
    totalNotes,
    totalHealthLogs,
    recentNotes,
    recentHealth
  });
});

app.get('/api/admin/notes', async (req: Request, res: Response) => {
  const notes = await db.collection('notes').find().sort({ createdAt: -1 }).toArray();
  res.json(notes);
});

app.delete('/api/admin/notes/:id', async (req: Request, res: Response) => {
  await db.collection('notes').deleteOne({ id: req.params.id });
  res.json({ success: true });
});

app.get('/api/admin/health', async (req: Request, res: Response) => {
  const health = await db.collection('health').find().sort({ createdAt: -1 }).toArray();
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
  await db.collection('emergencies').insertOne(event);
  res.status(201).json(event);
});

app.get('/api/admin/emergencies', async (req: Request, res: Response) => {
  const emergencies = await db.collection('emergencies').find().sort({ timestamp: -1 }).toArray();
  res.json(emergencies);
});

// ─── COMMUNITY BOARD ─────────────────────────────────────────────────────────
app.get('/api/community', async (req: Request, res: Response) => {
  const posts = await db.collection('communityPosts').find().sort({ createdAt: -1 }).toArray();
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
  await db.collection('communityPosts').insertOne(post);
  res.status(201).json(post);
});

app.delete('/api/community/:id', async (req: Request, res: Response) => {
  await db.collection('communityPosts').deleteOne({ id: req.params.id });
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
