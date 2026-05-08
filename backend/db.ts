import 'dotenv/config';
import { MongoClient, MongoClientOptions } from 'mongodb';

const uri = process.env.MONGO_URI!;

const options: MongoClientOptions = {
  serverSelectionTimeoutMS: 8000,   // fail fast if Atlas is unreachable
  connectTimeoutMS: 10000,
  socketTimeoutMS: 30000,
  tls: true,
  tlsAllowInvalidCertificates: false,
};

const client = new MongoClient(uri, options);

let isConnected = false;

client.connect()
  .then(() => {
    isConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    if (err.message?.includes('SSL') || err.message?.includes('tls')) {
      console.error('   ⚠️  LIKELY CAUSE: Your IP is not whitelisted in MongoDB Atlas.');
      console.error('   ➜  Go to: https://cloud.mongodb.com → Network Access → Add IP Address');
    }
    isConnected = false;
    // Don't exit — allow server to start so the user can see the error in the UI
  });

// Graceful shutdown
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
});

export const db = client.db();
export { isConnected };
export default client;