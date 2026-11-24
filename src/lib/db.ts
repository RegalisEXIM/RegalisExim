import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "regalis_exports";
if (!uri) throw new Error("Missing MONGODB_URI environment variable");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}
const clientPromise: Promise<MongoClient> =
  global._mongoClientPromise ?? new MongoClient(uri).connect();
if (process.env.NODE_ENV !== "production") global._mongoClientPromise = clientPromise;

export async function getDb(): Promise<Db> {
  return (await clientPromise).db(dbName);
}
