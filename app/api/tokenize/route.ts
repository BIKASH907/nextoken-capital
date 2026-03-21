import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function POST(req) {
  try {
    const client = await clientPromise;
    if (!client) return NextResponse.json({ success: false, error: 'DB missing' }, { status: 500 });
    const db = client.db('nextoken_capital');
    const data = await req.json();
    const assetSubmission = { ...data, status: 'pending', createdAt: new Date() };
    const result = await db.collection('tokenized_assets').insertOne(assetSubmission);
    return NextResponse.json({ success: true, message: 'Saved', id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
