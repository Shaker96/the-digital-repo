'use client'

import Image from 'next/image'
import Link from "next/link";

export default function Footer({ stats }: any) {
  return (
    <footer className='flex flex-col justify-between min-h-40 bg-primary'>
      <div className='flex flex-col lg:flex-row flex-wrap justify-start md:justify-between px-8 py-5'>
        <div className="flex items-center">
          <div>
            {/* <Image src={'/logo-footer.png'} width={230} height={100}/> */}
            <h1 className='text-white text-xl'>The Digital Repo</h1>
            <span className='text-base text-cyan-200'>by Shaker Chabarekh</span>
          </div>
        </div>
        <div className='flex flex-row flex-wrap items-center gap-x-6 lg:justify-between lg:mx-3'>
          <Image src={'images/nextjs.svg'} alt='nextjs' width={100} height={50} className='-my-2'/>
          <Image src={'images/sanity.svg'} alt='sanity' width={100} height={50} className='-my-2'/>
          <Image src={'images/vercel.svg'} alt='vercel' width={100} height={50} className='-my-2'/>
          <Image src={'images/tailwindcss.svg'} alt='tailwind' width={100} height={50} className='-my-2'/>
        </div>
        <div className='flex flex-row flex-wrap gap-5 items-center'>
          <Link href={'mailto:shakerchabarekh@gmail.com'}>
            <Image src={'images/gmail.svg'} alt='gmail' width={30} height={30}/>
          </Link>
          <Link href={'https://www.linkedin.com/in/shaker96/'}>
            <Image src={'images/linkedin.svg'} alt='linkedIn' width={30} height={30}/>
          </Link>
        </div>
        {/* <div className='p-4 pl-0 py-2 flex items-center'>
          <div className='flex flex-col items-center mr-2'>
            <span className='pb-1 text-base text-white'>Documents</span>
            <span className='rounded-full border-2 border-sea p-2 text-center w-fit grow-0 shrink aspect-square text-white'>{stats?.docs}</span>
          </div>
          <div className='flex flex-col items-center mx-2'>
            <span className='pb-1 text-base text-white'>Downloads</span>
            <span className='rounded-full border-2 border-sea p-2 text-center w-fit grow-0 shrink aspect-square text-white'>{stats?.downlds}</span>
          </div>
          <div className='flex flex-col items-center ml-2'>
            <span className='pb-1 text-base text-white'>Users</span>
            <span className='rounded-full border-2 border-sea p-2 text-center w-fit grow-0 shrink aspect-square text-white'>{stats?.users}</span>
          </div>
        </div> */}
      </div>
    </footer>
  )
}