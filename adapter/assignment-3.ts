import assignment2 from './assignment-2';
import previous_assignment from './assignment-2';

export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

export interface Filter {
  from?: number;
  to?: number;
  name?: string;
  author?: string;
}

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
//defines function to return a book
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  // ask assign 2 implementation for the list of books
  const allBooks = await assignment2.listBooks();
// if filters not provided OR if empty array, return all
  if(!filters || filters.length === 0) {
    return allBooks;
  }
  const matchesOneFilter = (book: Book, f: Filter): boolean => {
    // AND logic within a single filter:
    // Price lower bound
    if (typeof f.from === 'number' && book.price < f.from) return false;

    // Price upper bound
    if (typeof f.to === 'number' && book.price > f.to) return false;

    // Name contains (case-insensitive)
    if (typeof f.name === 'string' && f.name.trim() !== '') {
      const needle = f.name.trim().toLowerCase();
      if (!book.name.toLowerCase().includes(needle)) return false;
    }

    // Author contains (case-insensitive)
    if (typeof f.author === 'string' && f.author.trim() !== '') {
      const needle = f.author.trim().toLowerCase();
      if (!book.author.toLowerCase().includes(needle)) return false;
    }

    return true;
  };
  // OR logic across filters: include book if it matches at least one filter
  const dedup = new Map<string, Book>();

  for (const book of allBooks) {
    if (filters.some((f) => matchesOneFilter(book, f))) {
      // Use id if present; otherwise derive a stable-ish key
      const key = book.id ?? `${book.name}::${book.author}::${book.price}`;
      dedup.set(key, book);
    }
  }
   return Array.from(dedup.values());
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book);
}

async function removeBook(book: BookID): Promise<void> {
  await previous_assignment.removeBook(book);
}

const assignment = 'assignment-3';

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
};
