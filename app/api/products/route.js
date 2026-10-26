import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

// GET /api/products -> list all products
export async function GET() {
  try {
    const pool = getPool();

    const [rows] = await pool.query(
      `SELECT 
        products.id,
        products.name,
        products.description,
        products.price,
        products.category_id,
        categories.name AS category_name,
        products.created_at
      FROM products
      LEFT JOIN categories
        ON products.category_id = categories.id
      ORDER BY products.id DESC`
    );

    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/products -> create a new product
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, category_id } = body;

    if (!name || price === undefined || price === '') {
      return NextResponse.json(
        { error: 'Field "name" and "price" wajib diisi' },
        { status: 400 }
      );
    }

    const pool = getPool();

    const [result] = await pool.query(
      `INSERT INTO products
        (name, description, price, category_id)
       VALUES (?, ?, ?, ?)`,
      [
        name,
        description || null,
        price,
        category_id ? Number(category_id) : null
      ]
    );

    return NextResponse.json(
      {
        id: result.insertId,
        name,
        description,
        price,
        category_id: category_id ? Number(category_id) : null
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}