'use client';

import { signOut } from 'next-auth/react'
import { MdLogout } from "react-icons/md";

export default function Logout() {
  return (
    <span title='Logout' className="cursor-pointer text-lg text-red-400 hover:text-red-600" onClick={() => {signOut()}}>
      <MdLogout />
    </span>
  )
}
