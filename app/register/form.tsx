'use client'

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Error from "../components/error";
import Link from "next/link";
import Image from 'next/image'
import { FaUser } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdDriveFileRenameOutline } from "react-icons/md";

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [disableBtn, setDisableBtn] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setDisableBtn(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await fetch(`/api/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('pass'),
      }),
    });

    const res = await response.json();
    // console.log('RESPONSE', res, response.status);
    
    if (response.status === 500 && res.code == 23505) {
      setError(`Email registered, click on reset password.%${Math.random()}`);
      setDisableBtn(false);
    }

    if (response.status === 200) {
      const signInResp = await signIn('credentials', {
        email: formData.get('email'),
        password: formData.get('pass'),
        redirect: false,
      });

      // console.log('signInResp', signInResp);
  
      if (!signInResp?.error) {
        router.push('/');
        router.refresh();
      }
    } else {
      setError(`Error, please try again later.%${Math.random()}`);
      setDisableBtn(false);
    }
  }

  return (
    <main className="flex grow flex-col items-center justify-center pt-28 pb-10 px-10 bg-gradient-to-r from-cyan-300 to-purple-300">
      <div className="flex flex-col items-center justify-center w-4/5 sm:w-3/4 lg:w-2/4 shadow-lg rounded-lg p-5 bg-white">
        <h1 className="text-2xl font-bold mt-3 mb-4">Sign Up</h1>
        {/* <Image
          className=""
          src={''}
          alt={''}
          width={75}
          height={75}
        /> */}
        <form onSubmit={handleSubmit} className="flex flex-col align-middle w-full">
          <div className="flex flex-col">
            <label htmlFor="firstname" className="text-lg font-bold mt-3">First name</label>
            <div className="mt-1 mb-3 flex">
              <div className="p-2 rounded-l-lg w-9 bg-gray-200 flex items-center border border-gray-400 border-r-0 text-lg">
                <MdDriveFileRenameOutline />
              </div>
              <input
                name="firstname" type="text" required minLength={2} maxLength={100} placeholder="min. 2 caracteres"
                className="text-black text-lg h-11 border border-gray-400 rounded-r-lg w-full p-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="lastname" className="text-lg font-bold mt-3">Last name</label>
            <div className="mt-1 mb-3 flex">
              <div className="p-2 rounded-l-lg w-9 bg-gray-200 flex items-center border border-gray-400 border-r-0 text-lg">
                <MdDriveFileRenameOutline />
              </div>
              <input
                name="lastname" type="text" required minLength={2} maxLength={100} placeholder="min. 2 caracteres"
                className="text-black text-lg h-11 border border-gray-400 rounded-r-lg w-full p-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-bold mt-3">Email</label>
            <div className="mt-1 mb-3 flex">
              <div className="p-2 rounded-l-lg w-9 bg-gray-200 flex items-center border border-gray-400 border-r-0 text-lg">
                <FaUser />
              </div>
              <input 
                name="email" type="email" required minLength={2} maxLength={100} placeholder="ejemplo@mail.com" 
                className="text-black text-lg h-11 border border-gray-400 rounded-r-lg w-full p-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="pass" className="text-lg font-bold mt-3">Password</label>
            <div className="mt-1 mb-3 flex">
              <div className="p-2 rounded-l-lg w-9 bg-gray-200 flex items-center border border-gray-400 border-r-0 text-lg">
                <RiLockPasswordFill />
              </div>
              <input 
                name="pass" type="password" required minLength={6} placeholder="Minimo 6 caracteres"
                className="text-black text-lg h-11 border border-gray-400 rounded-r-lg w-full p-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
          <button 
            type="submit" 
            className={`flex items-center justify-center gap-x-3 px-4 py-2 mt-5 h-12 text-white text-lg bg-navy transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={disableBtn}
          >
            Create account
            {disableBtn && <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-white"></div>}
          </button>
          <div className="text-navy text-md pt-4">Already registered? <Link href="/login" className="cursor-pointer underline">Sign in here</Link></div>
        </form>
      </div>
      {!!error.length && <Error msg={error}/>}
    </main>
  )
}
