import Router from '@koa/router';
import { Book } from '../../adapter/assignment-3';
import { getDatabase } from './db';

console.log('LOADED lists.ts from Mongo version');

//defines the book type
type MongoBookDoc = {
  _id: unknown;
  name?: unknown;
  author?: unknown;
  description?: unknown;
  price?: unknown;
  image?: unknown;
};



const listRouter = new Router();

listRouter.get('/books', async (ctx) => {
  const filters = ctx.query.filters as
    | Array<{ from?: string; to?: string }>
    | undefined;

  try {
    let bookList: Book[] = await readBooksFromMongo();

    if (filters && Array.isArray(filters) && filters.length > 0) {
      if (!validateFilters(filters)) {
        ctx.status = 400;
        ctx.body = {
          error:
            'Invalid filters. Each filter must have valid "from" and "to" numbers where from <= to.',
        };
        return;
      }

      bookList = filterBooks(bookList, filters);
    }

    ctx.body = bookList;
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: `Failed to fetch books due to: ${error}` };
  }
});
async function readBooksFromMongo(): Promise<Book[]> {
  const db = getDatabase();
  const docs = await db.collection('books').find({}).toArray();
//Map body
  return docs.map((d: MongoBookDoc): Book => ({
  id: String(d._id),
  name: typeof d.name === 'string' ? d.name : '',
  author: typeof d.author === 'string' ? d.author : '',
  description: typeof d.description === 'string' ? d.description : '',
  price: typeof d.price === 'number' ? d.price : 0,
  image: typeof d.image === 'string' ? d.image : '',
}));
}

function validateFilters(filters: unknown): filters is unknown[] {
  if (!filters || !Array.isArray(filters)) {
    return false;
  }
  return true;
}

  // Check each filter object in the array
  return filters.every((filter) => {
    const from =
      filter.from !== undefined ? parseFloat(filter.from) : undefined;
    const to = filter.to !== undefined ? parseFloat(filter.to) : undefined;

    // If from is provided, it must be a valid number
    if (from !== undefined && isNaN(from)) {
      return false;
    }

    // If to is provided, it must be a valid number
    if (to !== undefined && isNaN(to)) {
      return false;
    }

    // If both are provided, from must be <= to
    if (from !== undefined && to !== undefined && from > to) {
      return false;
    }

    return true;
  });


// Filter books by price range - a book matches if it falls within ANY of the filter ranges
function filterBooks(
  bookList: Book[],
  filters: Array<{ from?: string; to?: string }>,
): Book[] {
  return bookList.filter((book) =>
    filters.some((filter) => {
      const from =
        filter.from !== undefined ? parseFloat(filter.from) : undefined;
      const to = filter.to !== undefined ? parseFloat(filter.to) : undefined;

      const matchesFrom = from === undefined || book.price >= from;
      const matchesTo = to === undefined || book.price <= to;

      return matchesFrom && matchesTo;
    }),
  );
}

export default listRouter;
