import { MongoClient, type Db, type Collection } from 'mongodb';
import { type Book } from './types';

const uri = globalThis.MONGO_URI ?? 'mongodb://mongo';
export const client = new MongoClient(uri);

export interface BookDatabaseAccessor {
  database: Db;
  books: Collection<Book>;
}

export function getBookDatabase(): BookDatabaseAccessor {
  // If we aren't testing, we use a fixed database name
// If testing, create a random database name for isolation
  const database = client.db(
    globalThis.MONGO_URI !== undefined
      ? `test_${Math.floor(Math.random() * 100000)}`
      : 'mcmasterful-books',
  );

  const books = database.collection<Book>('books');
  return { 
    
    database, 
    
    books };
}
