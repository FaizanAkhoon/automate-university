import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGO_URI!

const client = new MongoClient(uri)

client.connect()
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    client.close(); // Prevent internal timers from throwing uncaught errors
  })

export const db = client.db()
export default client