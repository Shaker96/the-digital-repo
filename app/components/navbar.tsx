"use client";

import Link from "next/link";
import Logout from "./logout";
import { usePathname } from 'next/navigation';
import Image from 'next/image'

export default function Navbar({ session }: any) {
  const pathname = usePathname();

  // console.log('Navbar', session);

  return (
    <nav className={`fixed w-full flex flex-col md:flex-row items-center justify-between md:h-20 px-10 py-5 md:py-0 gap-2 bg-navy z-10 ${['/login', '/register'].includes(pathname) ? '' : '' }`}>
      <Link href="/" className="text-xl font-semibold">
        {/* <Image src={'/logo-nav.png'} alt="" width={260} height={120}/> */}
        <h1>The Digital Repo</h1>
      </Link>
      {!!session && 
        <div className="flex items-center">
          <Link href="/about" className="px-4 py-2 mr-3 cursor-pointer bg-gradient-to-r from-cyan-300 to-purple-300 text-navy rounded ">About Us</Link>
          <Link href="/dashboard" className="px-4 pr-7 cursor-pointer text-white capitalize">{session.user.firstname} {session.user.lastname.slice(0, 1)}.</Link>
          <Logout></Logout>
        </div>
      }
      {!session && !['/login', '/register'].includes(pathname) && 
        <div className="flex items-center">
          <Link href="/about" className="px-4 py-2 mr-3 cursor-pointer bg-gradient-to-r from-cyan-300 to-purple-300 text-navy rounded ">About Us</Link>
          <Link className="ml-auto mr-3 px-4 py-2 text-navy bg-white rounded" href="/register">Sign Up</Link>
          <Link className="px-4 py-2 text-navy bg-white transition-colors rounded" href="/login">Log In</Link>
        </div>
      }
    </nav>
  )
}