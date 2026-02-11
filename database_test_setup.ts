import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll } from 'vitest';
import { client } from './src/database_access'; // adjust path if needed

let instance: MongoMemoryServer;

beforeAll(async () => {
  instance = await MongoMemoryServer.create({ binary: { version: '7.0.7' } });

  const uri = instance.getUri();
  globalThis.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  globalThis.__MONGOINSTANCE = instance;

  await client.connect();
});

afterAll(async () => {
  await client.close();
  await instance.stop({ doCleanup: true });
});
