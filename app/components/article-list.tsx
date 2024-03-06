'use client'

import { incrementDownloadCount, urlFor } from '../lib/sanity';
import { PortableText } from '@portabletext/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { MdArticle, MdSchool } from 'react-icons/md';
import { RiArticleFill } from "react-icons/ri";
import PdfViewer from './pdf-viewer';

const components = {
  types: {
    code: (props: any) => (
      <pre data-language={props.node.language}>
        <code>{props.node.code}</code>
      </pre>
    )
  }
}

export default function ArticleList({ articles, title, isHome }: any) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showArts, setShowArts] = useState(articles);
  const itemsPerPage = 3;

  useEffect(() => {
    setTotalPages(Math.ceil(articles.length / itemsPerPage));
  }, [articles]);

  useEffect(() => {
    const from = itemsPerPage * (page - 1);
    const to = itemsPerPage * page;
    setShowArts(articles.slice(from, to))
  }, [page, articles]);

  const clickHandler = (articleId: string) => {
    incrementDownloadCount(articleId);
  }

  const changePage = (e: any) => {
    setPage(parseInt(e.target.dataset.id));
  }

  return (
    <div className='pt-8 grow w-full'>
      <div className={`w-full flex items-center justify-end gap-3 pb-3 ${isHome ? 'hidden' : ''}`}>
        {totalPages > 1 && Array(totalPages).fill({}).map((d, i) =>
          <p
            key={i + 1}
            data-id={i + 1}
            className={`flex items-center justify-center py-1 w-9 border-navy ${page == (i + 1) ? 'bg-navy text-white' : 'border text-navy'} rounded-lg cursor-pointer`}
            onClick={changePage}
          >
            {i + 1}
          </p>
        )}
      </div>
      <div className={`grid grid-cols-1 gap-5 ${isHome ? 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4' : ''}`}>
        {showArts.map((art: any) => {
          // console.log(art);
          return (
            <div className={`flex justify-between items-center rounded-lg shadow-lg p-4 bg-white`} key={art._id}>
              <div className={`article flex flex-col min-h-80 h-full relative overflow-hidden shrink ${!isHome ? 'pr-3' : 'w-full'}`}>
                {!isHome &&
                  <>
                    <h3 className='py-2 pt-3 font-bold'>{art.title}</h3>

                    <div className='py-2'>
                      <div className='flex flex-col md:flex-row justify-between text-sm text-gray-400'>
                        <div>
                          {art.authors.slice(0, 2).map((aut: any) =>
                            <span key={aut._id} className='pr-3'>{aut.firstname} {aut.lastname?.slice(0, 1)}.</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='py-2 mb-2 relative w-full grow overflow-hidden text-sm'>
                      {art.abstract && <div><PortableText value={art.abstract} components={components} /></div>}
                      {art.date && <div className='mt-2 text-gray-400'>{new Date(art.date).getFullYear()}</div>}
                    </div>
                  </>
                }
                {isHome && art.fileUrl &&
                  <>
                    <Link
                      className='mx-auto flex m-2 shadow-lg overflow-hidden w-full h-[200px] max-w-[183px] min-w-[183px] max-h-[200px]'
                      href={`article/${art.fileUrl.split('/').pop()}`}
                      onClick={() => clickHandler(art._id)}
                      target="_blank"
                    >
                      <PdfViewer PDF={art.fileUrl} singlePage={true} height={200} width={200}></PdfViewer>
                    </Link>
                    <h3 className='py-2 pt-3 font-bold grow'>{art.title}</h3>
                  </>
                }
                <div className='flex items-center gap-2'>
                  {art.category.type === 'Article' && <RiArticleFill />}
                  {art.category.type === 'Blog' && <MdArticle />}
                  {art.category.type === 'Video' && <MdSchool />}
                  <span className='text-sm'>{art.category.type}</span>
                </div>
              </div>
              {!isHome && 
                <Link
                  className='ml-auto flex m-2 pr-2 shadow-lg overflow-hidden w-full max-w-[183px] min-w-[183px] max-h-[200px]'
                  href={`article/${art.fileUrl.split('/').pop()}`}
                  onClick={() => clickHandler(art._id)}
                  target="_blank"
                >
                  <PdfViewer PDF={art.fileUrl} singlePage={true} height={200} width={200}></PdfViewer>
                </Link>
              }
            </div>
          )
        })}
      </div>
    </div>
  )
}