'use client'

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react"
import Error from "../components/error";
import Link from "next/link";
import Image from 'next/image'
import { RiLockPasswordFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";

export default function Form() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const [disableBtn, setDisableBtn] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    setDisableBtn(true);
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('pass'),
      redirect: false,
    });

    // console.log({ response });

    if (!response?.error) {
      router.push('/');
      router.refresh();
    } else {
      setErrorCount(errorCount + 1);
      setError(`Invalid credentials. Please try again.%${errorCount}`);
      setDisableBtn(false);
    }
  }

  return (
    <main className="grow flex flex-col items-center justify-center pt-28 pb-10 px-10 bg-gradient-to-r from-cyan-300 to-purple-300">
      <div className="flex flex-col items-center justify-center w-2/5 shadow-lg rounded-lg p-5 bg-white">
        <h1 className="text-2xl font-bold my-3 px-4 py-2 text-black rounded-2xl">Welcome back!</h1>
        {/* <Image
          className=""
          src={''}
          alt={``}
          width={75}
          height={75}
        /> */}
        <form onSubmit={handleSubmit} className="flex flex-col align-middle w-full">
          <div className="flex flex-col">
            <label htmlFor="email" className="text-lg font-bold mt-3">Email</label>
            <div className="mt-1 mb-3 flex">
              <div className="p-2 rounded-l-lg w-9 bg-gray-200 flex items-center border border-gray-400 border-r-0 text-lg">
                <FaUser />
              </div>
              <input
                name="email" required type="email" placeholder="example@mail.com"
                className="text-black text-lg h-11 w-full border border-gray-400 rounded-r-lg p-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
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
                name="pass" required type="password" placeholder="Enter password"
                className="text-black text-lg h-11 w-full border border-gray-400 rounded-r-lg p-2 invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className={`flex items-center text-lg justify-center gap-x-3 px-4 py-2 mt-5 h-12 text-white bg-primary transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={disableBtn}
          >
            Log In
            {disableBtn && <div className="w-6 h-6 border-4 border-dashed rounded-full animate-spin border-white"></div>}
          </button>
          <div className="text-navy text-md pt-4">Not registered yet? <Link href="/register" className="cursor-pointer underline">Sign up here</Link></div>
        </form>
      </div>
      {!!error.length && <Error msg={error} />}
    </main>
  )
}
