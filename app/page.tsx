'use client'

import Searchbar from './components/searchbar';
import ArticleList from './components/article-list';
import { getAllArticles, searchArticles } from './lib/sanity';
import { useEffect, useState } from 'react';
import { MdArrowBack, MdOutlineSearch } from 'react-icons/md';
import { author, category } from './interfaces';
import Select from 'react-select';
import { FiSearch } from "react-icons/fi";
import Modal from './components/modal';
import Image from 'next/image'

export default function Home() {
  const year = new Date().getFullYear();
  const yearFrom = year - 5;

  const [articles, setArticles] = useState([]);
  const [resultArticles, setResultArticles] = useState([]);

  const [keyword, setKeyword] = useState<string>('');
  const [fixedKeyword, setFixedKeyword] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);

  const [fAuthors, setfAuthors] = useState<any[]>([]);
  const [fCategories, setfCategories] = useState<any[]>([]);

  const [selCategories, setSelCategories] = useState<string[]>([]);
  const [selAuthors, setSelAuthors] = useState<string[]>([]);

  const [fYearFrom, setfYearFrom] = useState<number>(yearFrom);
  const [fYearTo, setfYearTo] = useState<number>(year);

  useEffect(() => {
    (async () => {
      if (showSearch) return;
      const art = await getAllArticles();
      setArticles(art);
    })()
  }, [showSearch]);

  const handleInputChange = (e: any) => {
    setKeyword(e.target.value);
  }

  const clearSearch = () => {
    setShowSearch(false);
    setKeyword('');
  }

  const handleSearch = async () => {
    // console.log('search', selAuthors, selCategories);
    const data = await searchArticles(keyword);
    setArticles(data);
    setResultArticles(data);
    setShowSearch(true);
    extractInfo(data);
    setFixedKeyword(keyword);
  }

  const extractInfo = (data: any) => {
    let categs: any[] = [];
    let authrs: any[] = [];
    data.map((d: any) => {
      if (!categs.find(x => x._id === d.category._id)) {
        categs.push(d.category);
      }

      const a = d.authors.filter((au: any) => {
        return !authrs.find(x => x._id === au._id)
      })
      authrs = [...authrs, ...a];
    })

    // console.log('EXTRACT', categs, authrs);

    setfCategories(categs);
    setfAuthors(authrs);
  }

  const updateSelectedAuthors = (selected: any) => {
    // console.log('SELECTION', selected);

    setSelAuthors(selected.map((s: any) => s._id));
  }

  const checkHandler = (event: any) => {
    const value = event.target.value;
    const checked = event.target.checked;
    // console.log('value', value);
    // console.log('checked', checked);

    if (checked) {
      setSelCategories([...selCategories, value]);
    } else {
      setSelCategories(selCategories.filter((item) => item !== value));
    }
    // console.log('selected cats', selCategories);
  }

  const filterResults = () => {
    const filteredResults = resultArticles.filter((art: any) => {
      return (
        (selCategories.length === 0 || selCategories.includes(art.category._id)) &&
        (selAuthors.length === 0 || art.authors.find((aut: any) => selAuthors.includes(aut._id))) &&
        (!fYearFrom || new Date(art.date).getFullYear() >= fYearFrom) &&
        (!fYearTo || new Date(art.date).getFullYear() <= fYearTo)
      )
    });

    setArticles(filteredResults);
  }

  useEffect(() => {
    filterResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selAuthors, selCategories, fYearTo, fYearFrom]);

  const yearFromHandler = (e: any) => {
    if (fYearTo && e.target.value > fYearTo) {
      setfYearFrom(fYearTo);
      return
    }
    setfYearFrom(e.target.value);
  }

  const yearToHandler = (e: any) => {
    if (fYearFrom && e.target.value < fYearFrom) {
      setfYearFrom(fYearFrom);
      return
    }
    setfYearTo(e.target.value);
  }

  return (
    <main className="grow flex flex-col items-center justify-start pt-36 md:pt-20 pb-10 bg-sky-50">
      {/* <Modal /> */}
      <div className={`relative flex items-center justify-between bg-search-cover w-full p-10 ${showSearch ? 'h-28' : 'h-auto'}`}>
        <div className={`flex flex-col w-1/2 ${showSearch ? 'mx-auto' : ''}`}>
          {!showSearch && <h1 className='text-white text-3xl'>Open knowledge. Bright Future.</h1>}
          {!showSearch && <p className='text-white pt-6 text-md text-justify'>Welcome to The Digital Repo, built to inform you about state of the art technology. Built using NextJS, tailwind CSS & Sanity, hosted on Vercel.</p>}
          <div className={`flex flex-row items-center justify-between rounded-full border border-navy overflow-hidden w-full bg-white ${showSearch ? '' : 'mt-4'}`}>
            <input
              type="search" placeholder="Search The Digital Repo..."
              className="w-full m-1 rounded-l-full outline-none px-4 py-2 pl-5"
              value={keyword} onChange={handleInputChange}
            />
            <button
              type="button"
              className="text-xl flex-none h-12 border border-l-navy bg-white px-4 py-2 transition-colors"
              onClick={handleSearch}
            >
              <FiSearch />
            </button>
          </div>
        </div>
        {!showSearch && 
          <div 
            className='mx-auto shadow-[5px_5px_rgba(68,_204,_223,_0.4),_10px_10px_rgba(68,_204,_223,_0.3),_15px_15px_rgba(68,_204,_223,_0.2),_20px_20px_rgba(68,_204,_223,_0.1),_25px_25px_rgba(68,_204,_223,_0.05)]'
          >
            <Image
              className="rounded-xl"
              src={'/robot.jpg'}
              alt={`robot`}
              width={200}
              height={300}
            />
          </div>
        }
      </div>
      <div className='flex w-full items-center pt-10 px-10'>
        <div className='flex flex-col w-full'>
          <h2 className='font-bold mr-auto text-2xl'>
            {showSearch ? `Busqueda: ${fixedKeyword} (${articles.length} resultados)` : 'Novedades'}
            <div className="border-b border-b-navy"></div>
          </h2>
        </div>
        {showSearch &&
          <div className="flex items-center cursor-pointer hover:text-gray-500" onClick={clearSearch}>
            <MdArrowBack /><span className="pl-2">Go Back</span>
          </div>
        }
      </div>
      <div className='flex w-full px-10'>
        {showSearch &&
          <div className='flex flex-col p-8 pl-0 w-1/3'>
            <div className='py-2 flex flex-col'>
              <span className='pb-2 font-semibold'>Type</span>
              {fCategories.map((c) => {
                return (
                  <div key={c._id} className='flex items-center py-1'>
                    <input
                      type='checkbox'
                      name={c.name}
                      value={c._id}
                      onChange={checkHandler}
                      className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300'
                    />
                    <label htmlFor={c.name} className='ms-2 text-sm font-medium text-gray-900'>{c.type}</label>
                  </div>
                )
              })}
            </div>
            <div className='py-2 flex flex-col'>
              <span className='pb-2 font-semibold'>Author(s)</span>
              <Select
                isMulti
                name="authors"
                options={fAuthors}
                className="basic-multi-select w-full"
                classNamePrefix="select"
                placeholder="Selecciona"
                onChange={updateSelectedAuthors}
                getOptionValue={(option) => option._id}
                getOptionLabel={(option) => `${option.firstname ?? ''} ${option.lastname ?? ''}`}
              />
            </div>
            <div className='flex flex-wrap justify-between items-center py-2'>
              <span className='pb-2 font-semibold basis-full'>Year</span>
              <input
                type="number" name="from" min="1950" max={fYearTo} placeholder='Desde'
                value={fYearFrom} onChange={yearFromHandler}
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg w-2/5"
              />
              <input
                type="number" name="to" min={fYearFrom} max={year} placeholder='Hasta'
                value={fYearTo} onChange={yearToHandler}
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg w-2/5"
              />
            </div>
          </div>
        }
        <ArticleList articles={articles} isHome={!showSearch}/>
      </div>
    </main>
  )
}
