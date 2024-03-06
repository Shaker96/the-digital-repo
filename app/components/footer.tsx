'use client'

import Image from 'next/image'

export default function Footer({ stats }: any) {
  return (
    <footer className='flex flex-col justify-between min-h-40 bg-navy'>
      <div className='flex flex-wrap justify-start md:justify-between p-8'>
        <div className="flex items-center">
          <div>
            {/* <Image src={'/logo-footer.png'} width={230} height={100}/> */}
            <h1 className='text-white text-xl'>The Digital Repo</h1>
            <span className='text-base text-cyan-200'>by shakerchabarekh@gmail.com</span>
          </div>
        </div>
        <div className='p-4 pl-0 py-2 flex items-center'>
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
        </div>
      </div>
    </footer>
  )
}