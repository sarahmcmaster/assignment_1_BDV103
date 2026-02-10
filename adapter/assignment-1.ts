import _books from './../mcmasteful-book-list.json';

export interface Book {
  name: string;
  author: string;
  description: string;
  price: number;
  image: string;
}

// If you have multiple filters, a book matching any of them is a match.
async function listBooks(
  filters?: Array<{ from?: number; to?: number }>,
): Promise<Book[]> {
  const query =
    filters
      ?.map(({ from, to }, index) => {
        let result = '';
        if (typeof from === 'number') {
          result += `&filters[${index}][from]=${from}`;
        }
        if (typeof to === 'number') {
          result += `&filters[${index}][to]=${to}`;
        }
        return result;
      })
      .join('&') ?? '';

  // Use the browser fetch API to make a request to the /books endpoint with the constructed query string.
  const result = await fetch(`http://localhost:3000/books?${query}`);
  if (result.ok) {
    return (await result.json()) as Book[];
  } else {
    throw new Error('Failed to fetch books');
  }
}

const assignment = 'assignment-1';

export default {
  assignment,
  listBooks,
};
