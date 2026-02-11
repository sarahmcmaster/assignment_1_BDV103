declare global {
  var MONGO_URI: string | undefined;
  var __MONGOINSTANCE: import('mongodb-memory-server').MongoMemoryServer | undefined;
}
export {};
