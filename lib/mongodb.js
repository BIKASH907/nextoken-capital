import { MongoClient } from "mongodb";
const uri = process.env.MONGODB_URI;
let clientPromise;
if (!uri) {
  clientPromise = Promise.resolve(null);
} else if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}
export default clientPromise;

import mongoose from "mongoose";
let isConnected = false;
export async function connectDB() {
  if (isConnected) return;
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI not set");
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
}
