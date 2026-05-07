import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;
const DB_PATH = path.join(__dirname, 'db.json');

// CORS — allow credentials so Better Auth cookies travel between origins
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// ─── BETTER AUTH ─────────────────────────────────────────────────────────────
// Must be mounted BEFORE express.json() to avoid body-parsing conflicts.
app.all('/api/auth/*', toNodeHandler(auth));

app.use(express.json());

// Helper: read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// ─── NOTES ───────────────────────────────────────────────────────────────────
app.get('/api/notes', (req, res) => {
  const db = readDB();
  res.json(db.notes);
});

app.post('/api/notes', (req, res) => {
  const db = readDB();
  const note = {
    id: Date.now().toString(),
    title: req.body.title || 'Untitled',
    content: req.body.content || '',
    bullets: req.body.bullets || [],
    createdAt: new Date().toISOString()
  };
  db.notes.unshift(note);
  writeDB(db);
  res.status(201).json(note);
});

app.delete('/api/notes/:id', (req, res) => {
  const db = readDB();
  db.notes = db.notes.filter(n => n.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Notes Summarizer — rule-based bullet extraction
app.post('/api/notes/summarize', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const sentences = text
    .replace(/([.!?])\s+/g, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 20);

  // Score sentences by word importance
  const wordFreq = {};
  const words = text.toLowerCase().split(/\W+/);
  const stopWords = new Set(['the','a','an','is','are','was','were','be','been','have','has','had','do','does','did','will','would','could','should','may','might','to','of','in','on','at','by','for','with','this','that','these','those','it','its','he','she','we','they','i','you','and','or','but','not','from','as','so','if','then','when','where','how','what','who']);
  words.forEach(w => {
    if (w && !stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
  });

  const scored = sentences.map(s => {
    const sWords = s.toLowerCase().split(/\W+/);
    const score = sWords.reduce((acc, w) => acc + (wordFreq[w] || 0), 0) / (sWords.length || 1);
    return { sentence: s, score };
  });

  const topN = Math.min(Math.ceil(sentences.length * 0.4) + 2, 8);
  const bullets = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence))
    .map(s => s.sentence.replace(/^[•\-\*]\s*/, ''));

  res.json({ bullets });
});

// ─── STUDENT ──────────────────────────────────────────────────────────────────
app.get('/api/student', (req, res) => {
  const db = readDB();
  res.json(db.students[0] || {});
});

app.put('/api/student', (req, res) => {
  const db = readDB();
  if (db.students.length === 0) {
    db.students.push({ id: '1', ...req.body });
  } else {
    db.students[0] = { ...db.students[0], ...req.body };
  }
  writeDB(db);
  res.json(db.students[0]);
});

// ─── HEALTH ───────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const db = readDB();
  res.json(db.health);
});

app.post('/api/health', (req, res) => {
  const db = readDB();
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
  // Replace today's entry if exists
  const todayIdx = db.health.findIndex(h => h.date === entry.date);
  if (todayIdx >= 0) db.health[todayIdx] = entry;
  else db.health.unshift(entry);
  writeDB(db);
  res.status(201).json(entry);
});

// ─── MESSAGES ─────────────────────────────────────────────────────────────────
app.get('/api/messages', (req, res) => {
  const db = readDB();
  res.json(db.messages || []);
});

app.post('/api/admin/messages', (req, res) => {
  const db = readDB();
  db.messages = db.messages || [];
  const msg = {
    id: Date.now().toString(),
    title: req.body.title || 'Announcement',
    content: req.body.content || '',
    createdAt: new Date().toISOString()
  };
  db.messages.unshift(msg);
  writeDB(db);
  res.status(201).json(msg);
});

// ─── ADMIN ────────────────────────────────────────────────────────────────────
app.post('/api/admin/login', (req, res) => {
  const db = readDB();
  if (req.body.password === db.adminPassword) {
    res.json({ success: true, token: 'admin-token-2024' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

app.get('/api/admin/students', (req, res) => {
  const db = readDB();
  res.json(db.students);
});

app.get('/api/admin/stats', (req, res) => {
  const db = readDB();
  res.json({
    totalStudents: db.students.length,
    totalNotes: db.notes.length,
    totalHealthLogs: db.health.length,
    recentNotes: db.notes.slice(0, 5),
    recentHealth: db.health.slice(0, 7)
  });
});

app.get('/api/admin/notes', (req, res) => {
  const db = readDB();
  res.json(db.notes);
});

app.delete('/api/admin/notes/:id', (req, res) => {
  const db = readDB();
  db.notes = db.notes.filter(n => n.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

app.get('/api/admin/health', (req, res) => {
  const db = readDB();
  res.json(db.health);
});

// ─── EMERGENCIES ─────────────────────────────────────────────────────────────
app.post('/api/emergencies', (req, res) => {
  const db = readDB();
  db.emergencies = db.emergencies || [];
  const event = {
    id: Date.now().toString(),
    studentName: req.body.studentName || 'Unknown',
    department: req.body.department || 'Unknown',
    latitude: req.body.latitude,
    longitude: req.body.longitude,
    timestamp: new Date().toISOString()
  };
  db.emergencies.unshift(event);
  writeDB(db);
  res.status(201).json(event);
});

app.get('/api/admin/emergencies', (req, res) => {
  const db = readDB();
  res.json(db.emergencies || []);
});

// ─── COMMUNITY BOARD ─────────────────────────────────────────────────────────
app.get('/api/community', (req, res) => {
  const db = readDB();
  res.json(db.communityPosts || []);
});

app.post('/api/community', (req, res) => {
  const db = readDB();
  db.communityPosts = db.communityPosts || [];
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
  db.communityPosts.unshift(post);
  writeDB(db);
  res.status(201).json(post);
});

app.delete('/api/community/:id', (req, res) => {
  const db = readDB();
  db.communityPosts = (db.communityPosts || []).filter(p => p.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// ─── STUDENTS (legacy fetch for dashboard name) ──────────────────────────────
app.get('/api/students', (req, res) => {
  const db = readDB();
  res.json(db.students || []);
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Student Portal API running on http://localhost:${PORT}`);
  console.log(`🔐 Better Auth mounted at /api/auth/*`);
});
