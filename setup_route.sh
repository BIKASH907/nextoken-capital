#!/bin/bash
mkdir -p app/api/tokenize
echo "import { NextResponse } from 'next/server';" > app/api/tokenize/route.ts
echo "import clientPromise from '../../../lib/mongodb';" >> app/api/tokenize/route.ts
echo "" >> app/api/tokenize/route.ts
echo "export async function POST(req) {" >> app/api/tokenize/route.ts
echo "  try {" >> app/api/tokenize/route.ts
echo "    const client = await clientPromise;" >> app/api/tokenize/route.ts
echo "    if (!client) return NextResponse.json({ success: false, error: 'DB missing' }, { status: 500 });" >> app/api/tokenize/route.ts
echo "    const db = client.db('nextoken_capital');" >> app/api/tokenize/route.ts
echo "    const data = await req.json();" >> app/api/tokenize/route.ts
echo "    const assetSubmission = { ...data, status: 'pending', createdAt: new Date() };" >> app/api/tokenize/route.ts
echo "    const result = await db.collection('tokenized_assets').insertOne(assetSubmission);" >> app/api/tokenize/route.ts
echo "    return NextResponse.json({ success: true, message: 'Saved', id: result.insertedId }, { status: 201 });" >> app/api/tokenize/route.ts
echo "  } catch (error) {" >> app/api/tokenize/route.ts
echo "    return NextResponse.json({ success: false, error: error.message }, { status: 500 });" >> app/api/tokenize/route.ts
echo "  }" >> app/api/tokenize/route.ts
echo "}" >> app/api/tokenize/route.ts
echo "Done: File written to app/api/tokenize/route.ts"
