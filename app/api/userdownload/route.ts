import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const {id} = await request.json();
    // validate email and password

    const response = await sql`
      UPDATE users
      SET downloads = downloads + 1
      WHERE id = ${id}
    `;
    
  } catch (error) {
    console.log(error)
  }

  return NextResponse.json({ message: 'success'});
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    // validate email and password
    
    const response = await sql`
      SELECT downloads, subscription, renewal FROM users
      WHERE id = ${id}
    `;

    // console.log('RES', response.rows[0]);
    
    return NextResponse.json({ message: 'success', info: response.rows[0]});
    
  } catch (error) {
    console.log(error)
  }
}