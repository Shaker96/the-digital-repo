import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const {email, password, firstname, lastname} = await request.json();
    // validate email and password
    // console.log({ email, password });

    const hashedPass = await hash(password, 10);

    const response = await sql`
      INSERT INTO users (email, password, firstname, lastname)
      VALUES (${email}, ${hashedPass}, ${firstname}, ${lastname})
    `;

    return NextResponse.json({ message: 'success'});
    
  } catch (error: any) {
    return NextResponse.json({ message: 'error', code: error.code}, { status: 500 });
  }
}