import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import Navbar from './components/navbar'
import './globals.css'
import Provider from "@/app/context/client-provider";
import Footer from './components/footer';
import { getStats } from './lib/sanity';

const quicksand = Quicksand({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  title: 'The Digital Repo',
  description: 'Digital Repository powered by Next JS, Sanity and Vercel. By Shaker Chabarekh',
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const session = await getServerSession(authOptions);
  const stats = await getStats();

  return (
    <html lang="en">
      <body className={quicksand.className}>
        <Navbar session={session}/>
        <Provider session={session}>
          {children}
        </Provider>
        <Footer stats={stats}/>
      </body>
    </html>
  )
}
