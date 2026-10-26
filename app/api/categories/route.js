import { NextResponse } from "next/server";
import { getPool } from "@/lib/db";

export async function GET() {
  try {
    const pool = getPool();

    const [rows] = await pool.query(
      "SELECT id, name FROM categories ORDER BY id ASC",
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Categories error:", error);

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}