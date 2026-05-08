import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import client, { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

async function migrate() {
  console.log('🔄 Starting migration from db.json to MongoDB...');
  
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.log('⚠️ db.json not found. Nothing to migrate.');
      process.exit(0);
    }

    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    
    // Connect to MongoDB
    await client.connect();

    // Migrate Students
    if (data.students && data.students.length > 0) {
      await db.collection('students').deleteMany({});
      await db.collection('students').insertMany(data.students);
      console.log(`✅ Migrated ${data.students.length} students`);
    }

    // Migrate Notes
    if (data.notes && data.notes.length > 0) {
      await db.collection('notes').deleteMany({});
      await db.collection('notes').insertMany(data.notes);
      console.log(`✅ Migrated ${data.notes.length} notes`);
    }

    // Migrate Health
    if (data.health && data.health.length > 0) {
      await db.collection('health').deleteMany({});
      await db.collection('health').insertMany(data.health);
      console.log(`✅ Migrated ${data.health.length} health records`);
    }

    // Migrate Admin Password
    if (data.adminPassword) {
      await db.collection('settings').updateOne(
        { id: 'admin' },
        { $set: { id: 'admin', adminPassword: data.adminPassword } },
        { upsert: true }
      );
      console.log(`✅ Migrated admin settings`);
    }

    // Migrate Emergencies
    if (data.emergencies && data.emergencies.length > 0) {
      await db.collection('emergencies').deleteMany({});
      await db.collection('emergencies').insertMany(data.emergencies);
      console.log(`✅ Migrated ${data.emergencies.length} emergencies`);
    }

    // Migrate Community Posts
    if (data.communityPosts && data.communityPosts.length > 0) {
      await db.collection('communityPosts').deleteMany({});
      await db.collection('communityPosts').insertMany(data.communityPosts);
      console.log(`✅ Migrated ${data.communityPosts.length} community posts`);
    }

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('🔴 Migration failed:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

migrate();
