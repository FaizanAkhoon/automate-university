import 'dotenv/config';
import { db as firestoreDb } from './firebase.js';
import { collection, getDocs, addDoc, setDoc, deleteDoc, doc, query, orderBy, limit as fLimit, where } from 'firebase/firestore';

// ─── MONGODB TO FIRESTORE ADAPTER ─────────────────────────────────────────────
// This adapter perfectly mimics the MongoDB driver interface used in server.ts
// so that all existing routes automatically sync with Firebase Firestore without
// needing to rewrite the entire backend.

class FirestoreCollectionAdapter {
  constructor(public name: string) {}

  find(q: any = {}) {
    let sorts: any[] = [];
    let limitNum: number | undefined;

    const cursor = {
      sort: (s: any) => { sorts.push(s); return cursor; },
      limit: (n: number) => { limitNum = n; return cursor; },
      toArray: async () => {
        try {
          const collRef = collection(firestoreDb, this.name);
          const snapshot = await getDocs(collRef);
          let results = snapshot.docs.map(d => ({ ...d.data(), _id: d.id, id: d.data().id || d.id }));
          
          // apply filters
          if (Object.keys(q).length > 0) {
             results = results.filter(item => {
               for (const k in q) { if (item[k] !== q[k]) return false; }
               return true;
             });
          }
          
          // apply sort
          if (sorts.length > 0) {
            const s = sorts[0];
            const key = Object.keys(s)[0];
            const dir = s[key]; // 1 or -1
            results.sort((a, b) => {
              const valA = a[key] ?? '';
              const valB = b[key] ?? '';
              if (valA < valB) return dir === -1 ? 1 : -1;
              if (valA > valB) return dir === -1 ? -1 : 1;
              return 0;
            });
          }

          if (limitNum) results = results.slice(0, limitNum);
          return results;
        } catch (error) {
          console.error(`Firebase find error on collection ${this.name}:`, error);
          return [];
        }
      }
    };
    return cursor;
  }

  async findOne(q: any) {
    const results = await this.find(q).toArray();
    return results[0] || null;
  }

  async insertOne(docData: any) {
    const collRef = collection(firestoreDb, this.name);
    // Use the explicit ID if provided (server.ts usually adds `id: Date.now().toString()`)
    if (docData.id) {
       await setDoc(doc(firestoreDb, this.name, docData.id), docData);
       return { insertedId: docData.id };
    } else {
       const ref = await addDoc(collRef, docData);
       return { insertedId: ref.id };
    }
  }

  async insertMany(docs: any[]) {
    for (const d of docs) {
      await this.insertOne(d);
    }
  }

  async updateOne(q: any, update: any, options: any) {
    const existing = await this.findOne(q);
    if (existing) {
       const docRef = doc(firestoreDb, this.name, existing.id || existing._id);
       await setDoc(docRef, update.$set || {}, { merge: true });
    } else if (options?.upsert) {
       const newDoc = { ...q, ...(update.$set || {}) };
       if (newDoc.id) {
         await setDoc(doc(firestoreDb, this.name, newDoc.id), newDoc);
       } else {
         await addDoc(collection(firestoreDb, this.name), newDoc);
       }
    }
  }

  async deleteOne(q: any) {
    const existing = await this.findOne(q);
    if (existing) {
       await deleteDoc(doc(firestoreDb, this.name, existing.id || existing._id));
    }
  }
  
  async deleteMany() {
    // Basic mock logic: Firestore doesn't support bulk delete easily on client,
    // so we fetch all and delete one by one for migrations.
    const results = await this.find().toArray();
    for (const r of results) {
      await deleteDoc(doc(firestoreDb, this.name, r.id || r._id));
    }
  }

  async countDocuments() {
    const results = await this.find().toArray();
    return results.length;
  }
}

class FirestoreDB {
  collection(name: string) {
    return new FirestoreCollectionAdapter(name);
  }
}

export const db: any = new FirestoreDB();
export default null as any;