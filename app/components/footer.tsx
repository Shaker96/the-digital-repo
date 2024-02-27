'use client'

import Image from 'next/image'

export default function Footer({ stats }: any) {
  return (
    <footer className='flex flex-col justify-between min-h-40 bg-navy'>
      <div className='flex flex-wrap justify-center md:justify-between p-8 pb-1'>
        <div className="flex items-center">
          <div>
            {/* <Image src={'/logo-footer.png'} width={230} height={100}/> */}
            <h1>The Digital Repo</h1>
          </div>
        </div>
        <div className='flex flex-col py-2 justify-center'>
          <span className='px-2 text-base text-white'>shakerchabarekh@gmail.com</span>
        </div>
        <div className='p-4 pl-0 py-2 flex items-center'>
          <div className='flex flex-col items-center'>
            <span className='px-2 text-base text-white'>Documents</span>
            <span className='rounded-full border-2 border-sea p-2 text-center w-fit grow-0 shrink aspect-square text-white'>{stats?.docs}</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='px-2 text-base text-white'>Downloads</span>
            <span className='rounded-full border-2 border-sea p-2 text-center w-fit grow-0 shrink aspect-square text-white'>{stats?.downlds}</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='px-2 text-base text-white'>Users</span>
            <span className='rounded-full border-2 border-sea p-2 text-center w-fit grow-0 shrink aspect-square text-white'>{stats?.users}</span>
          </div>
        </div>
        <div className='flex justify-center w-full'>
          <a className="text-white text-base px-2 underline underline-offset-1" target='_blank'
            href="#"
          >Privacy Policy</a>
          <span className='px-1 text-white'>/</span>
          <a className="text-white text-base px-2 underline underline-offset-1" target='_blank'
            href="#"
          >Copyright</a>
        </div>
      </div>
    </footer>
  )
}