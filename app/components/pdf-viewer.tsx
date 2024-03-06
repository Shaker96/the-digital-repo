"use client"
import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdOutlineFileDownload } from "react-icons/md";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PdfViewer({ PDF, singlePage, height, width, canDownload, increaseDownloads, setShowModal, userId }: any) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [renderNavButtons, setRenderNavButtons] = useState<Boolean>(!singlePage);
  const onSuccess = (sample: any) => {
    alert('PDF document loaded successfully!');
    setPageNumber(1);
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }
  const previousPage = () => { changePage(-1); }
  const nextPage = () => { changePage(+1); }

  return (
    <div>
      {renderNavButtons &&
        <div className="h-16 pt-2 px-10 flex justify-between items-center fixed left-0 right-0 top-20 z-10 bg-white">
          <div className="flex items-center">
            <button
              disabled={pageNumber <= 1}
              onClick={previousPage}
              className="text-navy text-lg cursor-pointer"
            >
              <FaArrowLeft />
            </button>
            <span className="text-navy text-lg px-4">{pageNumber} / {numPages}</span>
            <button
              disabled={pageNumber === numPages}
              onClick={nextPage}
              className="text-navy text-lg cursor-pointer"
            >
              <FaArrowRight />
            </button>
          </div>
          {userId && canDownload &&
            <a
              className="flex items-center gap-1 rounded-lg bg-navy hover:bg-cyan-500 text-white p-2 cursor-pointer"
              download href={PDF} target="_blank" onClick={() => increaseDownloads?.()}
            >
              <span className="text-xl pl-1"><MdOutlineFileDownload /></span>
              <span className="px-2">Download</span>
            </a>}
          {userId && !canDownload &&
            <button
              className="flex items-center gap-1 rounded-lg bg-navy text-white p-2"
              onClick={() => setShowModal(true)}
            >
              <span className="text-xl pl-1"><MdOutlineFileDownload /></span>
              <span className="px-2">Download</span>
            </button>}
          {!userId &&
            <Link
              href="/register"
              className="flex items-center gap-1 rounded-lg bg-navy text-white p-2"
            >
              <span className="text-xl pl-1"><MdOutlineFileDownload /></span>
              <span className="px-2">Create free account to download</span>
            </Link>}
        </div>
      }
      <Document
        className={`${renderNavButtons ? 'pt-16' : ''}`}
        file={{ url: PDF }}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          onSuccess;
        }}
        onLoadError={(error) => console.log("Inside Error", error)}
      >
        <Page pageNumber={pageNumber} height={height} width={width} renderTextLayer={false} renderAnnotationLayer={false} />
      </Document>
    </div>
  )
}