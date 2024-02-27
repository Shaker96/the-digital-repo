'use client'

import Link from "next/link";
import { useState } from "react";
import { MdKeyboardArrowDown, MdOutlineFileDownload } from "react-icons/md"

export default function UsPage() {
  const [data, setData] = useState<any | []>([
    {
      title: 'About Us',
      value: '',
    },
    {
      title: 'Mission',
      value: '',
      visible: false
    },
    {
      title: 'Vision',
      value: '',
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
    <main className="pt-28 pb-20 px-10 grow bg-cyan-50">
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-semibold mb-6 py-2 px-4 text-white bg-gradient-to-r from-indigo-500 from-10%  via-sky-500 via-30% to-teal-300 rounded-3xl w-fit">About Us</h1>
        <p className="pb-8 text-xl text-justify">&emsp;&emsp;{data[0].value}</p>
        <div className="my-2 border border-navy rounded-3xl">
          <h2>
            <button 
              type="button" 
              className={`flex items-center justify-between w-full p-5 text-2xl bg-gradient-to-r from-indigo-500 from-10%  via-sky-500 via-30% to-teal-300 text-white border border-gray-200 gap-3 rounded-t-3xl ${data[1].visible ? 'border-b-0' : 'rounded-b-3xl'}`}
              data-index={1}
              onClick={toggleElement}
            >
              <span>{data[1].title}</span>
              <span className={`transition-all ${data[1].visible ? 'rotate-180' : '' }`}><MdKeyboardArrowDown /></span>
            </button>
          </h2>
          <div className={`transition-all overflow-hidden ${data[1].visible ? '' : 'h-0'}`}>
            <div className="p-5 rounded-b-3xl text-lg text-justify">
              <p>&emsp;&emsp;{data[1].value}</p>
            </div>
          </div>
        </div>
        <div className="my-2 border border-navy rounded-3xl">
          <h2>
            <button 
              type="button" 
              className={`flex items-center justify-between w-full p-5 text-2xl border border-gray-200 gap-3 rounded-t-3xl bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-teal-300 text-white ${data[2].visible ? 'border-b-0' : 'rounded-b-3xl'}`}
              data-index={2}
              onClick={toggleElement}
            >
              <span>{data[2].title}</span>
              <span className={`transition-all ${data[2].visible ? 'rotate-180' : '' }`}><MdKeyboardArrowDown /></span>
            </button>
          </h2>
          <div className={`transition-all overflow-hidden ${data[2].visible ? '' : 'h-0'}`}>
            <div className="p-5 rounded-b-3xl text-lg text-justify">
              <p>&emsp;&emsp;{data[2].value}</p>
            </div>
          </div>
        </div>
        <div className="my-2 border border-navy rounded-3xl">
          <Link
            className={`flex items-center justify-between w-full p-5 text-2xl border border-gray-200 gap-3 rounded-3xl bg-gradient-to-r from-indigo-500 from-10%  via-sky-500 via-30% to-teal-300 text-white`}
            href="/manual"
            target="_blank"
          >
            <span className="">User manual</span>
            <span className="text-xl pl-1"><MdOutlineFileDownload  /></span>
          </Link>
        </div>
      </div>
    </main>
  )
}
