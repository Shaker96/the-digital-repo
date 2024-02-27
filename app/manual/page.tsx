'use client'

import PdfViewer from '../components/pdf-viewer';

export default function Manual({ params }: any) {
  return (
    <div className="pt-20 full-pdf pdf-article">
      <PdfViewer 
        PDF={''} 
        pageNumber={1} 
        width={1000}
        canDownload={true}
      ></PdfViewer>
    </div>
  )
}