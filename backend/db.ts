import 'dotenv/config';
import { MongoClient, MongoClientOptions } from 'mongodb';

// ─── MOCK IN-MEMORY DATABASE FALLBACK ─────────────────────────────────────────
// This ensures that even if MongoDB fails to connect, the API won't crash and 
// features like the Emergency SOS button will still work (in-memory).
class MockCollection {
  name: string;
  data: any[];
  constructor(name: string) {
    this.name = name;
    this.data = [];
  }
  find(query: any = {}) {
    return {
      sort: () => this,
      limit: (n: number) => ({ toArray: async () => this.data.slice(0, n) }),
      toArray: async () => this.data.filter(item => {
        for (const k in query) { if (item[k] !== query[k]) return false; }
        return true;
      })
    };
  }
  async findOne(query: any) {
    return this.data.find(item => {
      for (const k in query) { if (item[k] !== query[k]) return false; }
      return true;
    }) || null;
  }
  async insertOne(doc: any) {
    this.data.push(doc);
    return { insertedId: doc.id || Date.now().toString() };
  }
  async insertMany(docs: any[]) {
    this.data.push(...docs);
  }
  async updateOne(query: any, update: any, options: any) {
    const existing = await this.findOne(query);
    if (existing) {
      if (update.$set) Object.assign(existing, update.$set);
    } else if (options?.upsert) {
      this.data.push({ ...query, ...(update.$set || {}) });
    }
  }
  async deleteOne(query: any) {
    const idx = this.data.findIndex(item => {
      for (const k in query) { if (item[k] !== query[k]) return false; }
      return true;
    });
    if (idx !== -1) this.data.splice(idx, 1);
  }
  async deleteMany() {
    this.data = [];
  }
  async countDocuments() {
    return this.data.length;
  }
}

class MockDB {
  collections: Record<string, MockCollection> = {};
  collection(name: string) {
    if (!this.collections[name]) this.collections[name] = new MockCollection(name);
    return this.collections[name];
  }
}

// ─── MONGODB CONNECTION ───────────────────────────────────────────────────────
let isConnected = false;
let dbInstance: any = new MockDB();
let clientInstance: any = null;

const uri = process.env.MONGO_URI;

if (uri) {
  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  };

  clientInstance = new MongoClient(uri, options);
  
  clientInstance.connect()
    .then(() => {
      isConnected = true;
      dbInstance = clientInstance.db();
      console.log('✅ Connected to MongoDB Atlas successfully.');
    })
    .catch((err: any) => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️  Falling back to IN-MEMORY Mock Database. Data will reset on server restart.');
    });
} else {
  console.warn('⚠️  No MONGO_URI provided in environment. Using IN-MEMORY Mock Database.');
}

// Export a proxy so db always points to the active database (Mock or Real)
export const db = new Proxy({}, {
  get: (_, prop) => {
    return dbInstance[prop];
  }
});

export default clientInstance || { close: async () => {} };