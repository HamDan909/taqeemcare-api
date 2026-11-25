require('dotenv').config();

const mongoose = require('mongoose');
const { connectDb } = require('./config/db');
const { createApp } = require('./app');
const { seed } = require('./seed/seed');

async function startMemoryDb() {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGODB_URI = uri.endsWith('/') ? `${uri}ruknaltaqeem` : uri;
  console.log('Using in-memory MongoDB');
  return mongod;
}

async function main() {
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'rukn-altaqeem-dev-secret';
  }
  let memoryMode = process.env.USE_MEMORY_DB === 'true';
  if (memoryMode) {
    await startMemoryDb();
  } else if (!process.env.MONGODB_URI) {
    process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/ruknaltaqeem';
  }

  try {
    await connectDb();
  } catch (err) {
    console.warn('MongoDB connection failed, starting in-memory MongoDB:', err.message);
    await mongoose.disconnect().catch(() => {});
    await startMemoryDb();
    await connectDb();
    memoryMode = true;
  }

  if (memoryMode || process.env.SEED_ON_START === 'true') {
    const result = await seed();
    console.log('Seed ready', result);
  }

  const port = Number(process.env.PORT) || 4000;
  const app = createApp();
  app.listen(port, '0.0.0.0', () => {
    console.log(`ركن التعقيم API on http://localhost:${port}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
