import clientPromise from "../../../lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) {
      return NextResponse.json({ error: "Database URI missing" }, { status: 500 });
    }
    return NextResponse.json({ status: "Database Connected!" });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
