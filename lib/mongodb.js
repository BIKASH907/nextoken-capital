import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  // During 'next build', sometimes env vars aren't loaded into certain processes.
  // This prevents the whole build from failing.
  console.warn('MONGODB_URI is missing from process.env');
}

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, we check uri existence before connecting
  if (uri) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  } else {
    clientPromise = Promise.reject(new Error("Missing MONGODB_URI"));
  }
}

export default clientPromise;