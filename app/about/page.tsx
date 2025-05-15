'use client'

import Link from "next/link";
import { useState } from "react";
import { MdKeyboardArrowDown, MdOutlineFileDownload } from "react-icons/md"

export default function UsPage() {
  const [data, setData] = useState<any | []>([
    {
      title: 'About Us',
      value: 'Welcome to our online repository for academic documents in the field of artificial intelligence! This platform has been meticulously developed by Shaker Chabarekh as part of his portfolio as a passionate and dedicated software engineer.',
    },
    {
      title: 'Mission',
      value: 'To facilitate the advancement of knowledge and innovation in the field of artificial intelligence by providing a comprehensive and accessible online repository for academic documents, fostering collaboration, learning, and research worldwide.',
      visible: false
    },
    {
      title: 'Vision',
      value: 'We envision a world where access to cutting-edge research and scholarly resources in artificial intelligence is effortless and universal. Through our online repository, we aim to empower researchers, students, and professionals to explore, discover, and contribute to the forefront of AI knowledge, driving progress and innovation in this dynamic field.',
      visible: false
    }
  ]);

  const toggleElement = (e: any) => {
    const index = parseInt(e.currentTarget.dataset.index);
    // console.log('INDEX', index, e.target.dataset.index);
    const updated = data.map((d: any, i: number) => {
      if (index === i) {
        d = {...d, visible: !d.visible}
      }
      return d;
    })
    // console.log(updated);
    setData(updated);
  }

  return (
    <main className="pt-40 md:pt-28 pb-10 md:pb-20 px-10 grow bg-cyan-50">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold mb-6 py-2 text-black w-fit">About Us</h1>
        <p className="pb-8 text-xl text-justify">&emsp;&emsp;{data[0].value}</p>
        <div className="my-2 border border-navy rounded-3xl">
          <h2>
            <button 
              type="button" 
              className={`flex items-center justify-between w-full p-5 text-2xl bg-gradient-to-r from-indigo-100 from-10%  via-sky-100 via-30% to-teal-100 text-black border border-gray-100 gap-3 rounded-t-3xl ${data[1].visible ? 'border-b-0' : 'rounded-b-3xl'}`}
              data-index={1}
              onClick={toggleElement}
            >
              <span>{data[1].title}</span>
              <span className={`transition-all ${data[1].visible ? 'rotate-180' : '' }`}><MdKeyboardArrowDown /></span>
            </button>
          </h2>
          <div className={`transition-all overflow-hidden ${data[1].visible ? '' : 'h-0'}`}>
            <div className="p-5 rounded-b-3xl text-lg text-justify">
              <p>{data[1].value}</p>
            </div>
          </div>
        </div>
        <div className="my-2 border border-navy rounded-3xl">
          <h2>
            <button 
              type="button" 
              className={`flex items-center justify-between w-full p-5 text-2xl border border-gray-100 gap-3 rounded-t-3xl bg-gradient-to-r from-indigo-100 from-10% via-sky-100 via-30% to-teal-100 text-black ${data[2].visible ? 'border-b-0' : 'rounded-b-3xl'}`}
              data-index={2}
              onClick={toggleElement}
            >
              <span>{data[2].title}</span>
              <span className={`transition-all ${data[2].visible ? 'rotate-180' : '' }`}><MdKeyboardArrowDown /></span>
            </button>
          </h2>
          <div className={`transition-all overflow-hidden ${data[2].visible ? '' : 'h-0'}`}>
            <div className="p-5 rounded-b-3xl text-lg text-justify">
              <p>{data[2].value}</p>
            </div>
          </div>
        </div>
        {/* <div className="my-2 border border-navy rounded-3xl">
          <Link
            className={`flex items-center justify-between w-full p-5 text-2xl border border-gray-200 gap-3 rounded-3xl bg-gradient-to-r from-indigo-500 from-10%  via-sky-500 via-30% to-teal-300 text-white`}
            href="/manual"
            target="_blank"
          >
            <span className="">User manual</span>
            <span className="text-xl pl-1"><MdOutlineFileDownload  /></span>
          </Link>
        </div> */}
      </div>
    </main>
  )
}
