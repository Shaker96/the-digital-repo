'use client'

import { useEffect, useState } from 'react';
import PdfViewer from '../../components/pdf-viewer';
import { useSession } from 'next-auth/react';
import Modal from '@/app/components/modal';

export default function Article({ params }: any) {
  const { data: session } = useSession();
  const user = session?.user as any;

  const url = 'https://cdn.sanity.io/files/a8orhjh3/production/'
  // const [windowSize, setWindowSize] = useState({
  //   width: window.innerWidth * 0.75,
  //   height: window.innerHeight,
  // });

  const [canDownload, setCanDownload] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      // console.log('SESSION', session);
      console.log('USER', user);
  
      if (!user || user.downloads >= user.totalDownloads) {
        setCanDownload(false);
      }
    })()
  }, []);

  const increaseDownloads = async() => {
    const response = await fetch(`/api/userdownload`, {
      method: 'POST',
      body: JSON.stringify({
        id: user.id
      }),
    });
    // console.log('DOWNLOAD UP', response);
  }

  return (
    <div className="pt-20 full-pdf pdf-article">
      {showModal && <Modal setShowModal={setShowModal} userId={user?.id}/>}
      <PdfViewer 
        PDF={url + params.id} 
        pageNumber={1} 
        width={1000} 
        canDownload={canDownload} 
        setShowModal={setShowModal}
        increaseDownloads={increaseDownloads}
        userId={user?.id}
      ></PdfViewer>
    </div>
  )
}