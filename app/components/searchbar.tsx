'use client'

import { useState } from "react"
import { searchArticles } from "../lib/sanity";

export default function Searchbar() {
  const [keyword, setKeyword] = useState('');

  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
  }

  const handleSearch = async(e: any) => {
    // console.log('search');
    
    // const data = await searchArticles(keyword);

    // console.log(data);
  }

  return (
    <form className="flex flex-row items-center justify-between rounded-full border border-cyan-400 overflow-hidden w-full lg:w-1/2">
      <input 
        type="search" placeholder="Search The Digital Repo..." 
        className="w-full m-1 rounded-l-full outline-none px-4 py-2 pl-5" 
        value={keyword} onChange={handleInputChange}
      />
      <button type="submit" className="flex-none h-12 bg-cyan-400 hover:bg-cyan-500 px-4 py-2 transition-colors" onClick={handleSearch}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>
    </form>
  )
}
