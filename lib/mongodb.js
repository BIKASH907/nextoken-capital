import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn("MONGODB_URI is not defined");
}

const client = uri ? new MongoClient(uri) : null;
const clientPromise = client ? client.connect() : Promise.resolve(null);

export default clientPromise;
