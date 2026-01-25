import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import qs from 'koa-qs';
import bookRoutes from './books/book_routes';
import { connectToDatabase } from "./books/db";

const app = new Koa();
qs(app);

app.use(cors());
app.use(bodyParser());
app.use(bookRoutes.allowedMethods());
app.use(bookRoutes.routes());

const PORT = 3000;
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });