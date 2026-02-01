import assignment1 from './assignment-1';

export type BookID = string;

export interface Book {
  id?: BookID;
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

// helper guards
function hasErrorField(value: unknown): value is { error: unknown } {
  return typeof value === 'object' && value !== null && 'error' in value;
}

function hasIdField(value: unknown): value is { id: unknown } {
  return typeof value === 'object' && value !== null && 'id' in value;
}


async function listBooks(
  filters?: Array<{ from?: number; to?: number }>,
): Promise<Book[]> {
  return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
  const baseUrl = 'http://localhost:3000';

  const hasId = typeof book.id === 'string' && book.id.trim().length > 0;
  const url = hasId
    ? `${baseUrl}/books/${encodeURIComponent(book.id!)}`
    : `${baseUrl}/books`;

  const method = hasId ? 'PUT' : 'POST';

  const result = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: book.name,
      author: book.author,
      description: book.description,
      price: book.price,
      image: book.image,
    }),
  });

  // If the API returned an error status, throw a descriptive Error
  if (!result.ok) {
    let apiMessage = '';
    try {
      const err: unknown = await result.json();
     if (hasErrorField(err)) apiMessage = String(err.error);
    } catch {
  // Response body wasn't JSON (or couldn't be read).
  }

    throw new Error(
      `Failed to ${hasId ? 'update' : 'create'} book (HTTP ${result.status})` +
        (apiMessage ? `: ${apiMessage}` : ''),
    );
  }

  // On success, the API should return JSON including an id
const data: unknown = await result.json();

if (!hasIdField(data) || data.id === undefined || data.id === null) {
  throw new Error('Response did not include id');
}

return String(data.id);
}

async function removeBook(bookId: BookID): Promise<void> {
  const baseUrl = 'http://localhost:3000';

  if (!bookId || typeof bookId !== 'string') {
    throw new Error('bookId is required');
  }

  const url = `${baseUrl}/books/${encodeURIComponent(bookId)}`;

  const result = await fetch(url, { method: 'DELETE' });

  if (!result.ok) {
    let apiMessage = '';
    try {
      const err: unknown = await result.json();
      if (hasErrorField(err)) apiMessage = String(err.error);
    } catch {
      // Response body wasn't JSON (or couldn't be read). Ignore and use generic message.
    }

    throw new Error(
      `Failed to delete book (HTTP ${result.status})` +
        (apiMessage ? `: ${apiMessage}` : ''),
    );
  }
}

const assignment = 'assignment-2';

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks,
};
