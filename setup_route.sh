#!/bin/bash
mkdir -p app/api/tokenize
cat << 'INNER_EOF' > app/api/tokenize/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("nextoken_capital");
    const data = await req.json();
    const assetSubmission = { 
      ...data, 
      status: 'pending', 
      createdAt: new Date() 
    };
    const result = await db.collection("tokenized_assets").insertOne(assetSubmission);
    return NextResponse.json({ 
      success: true, 
      message: "Asset saved", 
      id: result.insertedId 
    }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Database Error" 
    }, { status: 500 });
  }
}
INNER_EOF
echo "Route created successfully at app/api/tokenize/route.ts"
