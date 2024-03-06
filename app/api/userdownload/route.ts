import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function POST(request: Request) {
  try {
    const {id} = await request.json();
    // validate email and password

    const response = await sql`
      UPDATE subscribed_users
      SET downloads = downloads + 1
      WHERE user_id = ${id}
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
      SELECT su.downloads, su.uploads, s.name, s.downloads as total_downloads, s.uploads as total_uploads 
      FROM subscribed_users su
      INNER JOIN subscriptions s ON s.id = su.subscription_id
      WHERE su.user_id = ${id}
    `;

    // console.log('RES', response.rows[0]);
    
    return NextResponse.json({ message: 'success', info: response.rows[0]});
    
  } catch (error) {
    console.log(error)
  }
}