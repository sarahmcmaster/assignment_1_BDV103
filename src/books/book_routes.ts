import Router from '@koa/router';
import listRouter from './lists';
import books from '../../mcmasteful-book-list.json';

const router = new Router();

// List books route (implemented) - use routes from lists.ts
router.use(listRouter.routes());
router.use(listRouter.allowedMethods());

// Create book route (not yet implemented)
router.post('/books', async (ctx) => {
 const body = ctx.request.body as any;

  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const author = typeof body?.author === 'string' ? body.author.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const image = typeof body?.image === 'string' ? body.image.trim() : '';

  // price could arrive as a number (expected) or as a string
  const priceRaw = body?.price;
  const price =
    typeof priceRaw === 'number'
      ? priceRaw
      : typeof priceRaw === 'string'
        ? Number(priceRaw)
        : NaN;

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
    ctx.body = { error: 'image is required' };
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

  books.push(newBook);

  ctx.status = 201;
  ctx.body = newBook;
});

// Update book route (not yet implemented)
router.put('/books/:id', async (ctx) => {
  ctx.status = 501;
  ctx.body = { error: 'Update book not yet implemented' };
});

export default router;
