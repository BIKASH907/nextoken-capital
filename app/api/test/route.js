import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("nextoken");

    // This checks if the connection is alive by "pinging" the database
    const status = await db.command({ ping: 1 });

    return NextResponse.json({
      message: "Successfully connected to MongoDB Atlas!",
      database: "nextoken",
      status: status
    });
  } catch (e) {
    console.error("Database connection error:", e);
    return NextResponse.json(
      { error: "Failed to connect to the database", details: e.message },
      { status: 500 }
    );
  }
}