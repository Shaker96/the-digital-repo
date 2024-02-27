import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const {id, plan, renewal} = await request.json();
    // validate email and password

    const response = await sql`
      UPDATE users
      SET subscription = ${plan}, renewal = ${renewal}
      WHERE id = ${id}
    `;
    
  } catch (error) {
    console.log(error)
  }

  return NextResponse.json({ message: 'success'});
}