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

  const db = getDatabase ();
// writes new book to collection
  const result = await db.collection("books").insertOne({
    name,
    author,
    description,
    price,
    image,
  });
//returns message 
 ctx.status = 201;
  ctx.body = {
    id: String(result.insertedId),
    name,
    author,
    description,
    price,
    image,
  };
});

//Delete a book (implemented)
router.delete('/books/:id', async (ctx) => {
  const id = String(ctx.params.id ?? "").trim();

  //validation of id string to see if there
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: "id is required" };
    return;
  }

  //find the book record
let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } 
catch {
    ctx.status = 400;
    ctx.body = { error: "id must be a valid ObjectId" };
    return;
  }

  const db = getDatabase();
  const result = await db.collection("books").deleteOne({ _id });

  if (result.deletedCount === 0) {
    ctx.status = 404;
    ctx.body = { error: "Book not found" };
    return;
  }

  ctx.status = 204;
});

// Update book route (implemented)
router.put('/books/:id', async (ctx) => {
  const id = String(ctx.params.id ?? "").trim();
// if ID blank -- send error
  if (!id) {
    ctx.status = 400;
    ctx.body = { error: "id is required" };
    return;
  }

  let _id: ObjectId;
  try {
    _id = new ObjectId(id);
  } catch {
    ctx.status = 400;
    ctx.body = { error: "id must be a valid ObjectId" };
    return;
  }

  const body = ctx.request.body as any;

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const author = typeof body?.author === 'string' ? body.author.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const image = typeof body?.image === 'string' ? body.image.trim() : '';

  const priceRaw = body?.price;
  const price =
    typeof priceRaw === 'number'
      ? priceRaw
      : typeof priceRaw === 'string'
        ? Number(priceRaw)
        : NaN;
// error handling for Name, author, descript, number, image
  if (!name) { ctx.status = 400; ctx.body = { error: 'Name is required' }; return; }
  if (!author) { ctx.status = 400; ctx.body = { error: 'Author is required' }; return; }
  if (!description) { ctx.status = 400; ctx.body = { error: 'Description is required' }; return; }
  if (!Number.isFinite(price) || price < 0) { ctx.status = 400; ctx.body = { error: 'price must be a non-negative number' }; return; }
  if (!image) { ctx.status = 400; ctx.body = { error: 'image url is required' }; return; }

  const db = getDatabase();

  const result = await db.collection("books").findOneAndUpdate(
    { _id },
    { $set: { name, author, description, price, image } },
    { returnDocument: "after" }
  );

  if (!result.value) {
    ctx.status = 404;
    ctx.body = { error: "Book not found" };
    return;
  }

  ctx.status = 200;
  ctx.body = {
    id,
    name: result.value.name,
    author: result.value.author,
    description: result.value.description,
    price: result.value.price,
    image: result.value.image,
  };
});

export default router;
