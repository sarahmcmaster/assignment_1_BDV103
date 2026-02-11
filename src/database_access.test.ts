import { test, expect } from 'vitest';
import { getBookDatabase } from './database_access';

test('getBookDatabase returns a books collection', async () => {
  const { books, database } = getBookDatabase();

  await books.insertOne({
    name: 'Test Book',
    author: 'Tester',
    description: 'desc',
    price: 10,
    image: 'img',
  });

  const found = await books.findOne({ name: 'Test Book' });
  expect(found?.author).toBe('Tester');

  await database.dropDatabase(); 
});
