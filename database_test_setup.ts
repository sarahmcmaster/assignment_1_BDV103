import { MongoMemoryServer } from 'mongodb-memory-server';
import { beforeAll, afterAll } from 'vitest';

let instance: MongoMemoryServer;

beforeAll(
    async () => {
  instance = await MongoMemoryServer.create({ 
    binary: { version: '7.0.7' } });

  const uri = instance.getUri();
  globalThis.MONGO_URI = uri.slice(0, uri.lastIndexOf('/'));
  globalThis.__MONGOINSTANCE = instance;

  // Client imports AFTER MONGO_URI is set = database_access.ts uses the in-memory URI
  const { client } = await import('./src/database_access'); // adjust path if needed
  await client.connect()

},
60000, 
);

afterAll(async () => {
  // Close the MongoClient 
  const { client } = await import('./src/database_access');
  await client.close();
// in case beforeAll fails
     if (instance) {
    await instance.stop({ doCleanup: true });
    instance = undefined;
  }
},
60000
);
