import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI as string;

// Initialize MongoDB client
const client = new MongoClient(uri);

// Try to connect when the module loads
client.connect()
  .then(() => console.log('🟢 Successfully connected to MongoDB'))
  .catch((err) => console.error('🔴 MongoDB connection error:', err));

export const db = client.db();
export default client;
