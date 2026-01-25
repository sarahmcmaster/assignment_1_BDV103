import Router from '@koa/router';
import listRouter from './lists';
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { getDatabase } from "./db";

const router = new Router();

// List books route (implemented) - use routes from lists.ts
router.use(listRouter.routes());
router.use(listRouter.allowedMethods());

// Create book route (implemented)
router.post('/books', async (ctx) => {
 const body = ctx.request.body as any;

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const author = typeof body?.author === 'string' ? body.author.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const image = typeof body?.image === 'string' ? body.image.trim() : '';

  // if price could arrives as a number (expected) or as a string
  const priceRaw = body?.price;
  const price =
    typeof priceRaw === 'number'
      ? priceRaw
      : typeof priceRaw === 'string'
        ? Number(priceRaw)
        : NaN;
// validations and error handling if data is unexpected
  if (!name) {
    ctx.status = 400;
    ctx.body = { error: 'Name is required' };
    return;
  }

  if (!author) {
    ctx.status = 400;
    ctx.body = { error: 'Author is required' };
    return;
  }

   if (!description) {
    ctx.status = 400;
    ctx.body = { error: 'Description is required' };
    return;
  }

  if (!Number.isFinite(price) || price < 0) {
    ctx.status = 400;
    ctx.body = { error: 'price must be a non-negative number' };
    return;
  }

    if (!image) {
    ctx.status = 400;
    ctx.body = { error: 'image url is required' };
    return;
  }
  const newBook = {
    id: crypto.randomUUID(),
    name,
    author,
    description,
    price,
    image,
  };
  //push books to end of lsit array
  books.push(newBook);

  ctx.status = 201;
  ctx.body = newBook;
});

//delete a book
router.delete("/books/:id", async (ctx) => {
  const id = ctx.params.id;

  //validation of id string to see if there
  if (!id || typeof id !== "string") {
  ctx.status = 400;
  ctx.body = { error: "id is required" };
  return;
}

  //find the book record
const index = (books as any).findIndex((b: any) => b.id === id);
// if book is not found, return 404 message
if (index == -1) {
  ctx.status = 404; 
  ctx.body = {error: "Book not found"};
  return;
}
//removing the record
(books as any).splice(index, 1);
ctx.status = 204; 
});


// Update book route (not yet implemented)
router.put('/books/:id', async (ctx) => {
  ctx.status = 501;
  ctx.body = { error: 'Update book not yet implemented' };
});

export default router;
