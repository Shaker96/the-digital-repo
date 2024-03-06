'use client'

import { FormEvent, useEffect, useState } from "react"
import { deleteArticle, getAllAuthors, getAllCategories, getUserArticles, saveNewArticle, saveNewFile } from "../lib/sanity"
import { article, author, category, chatQuestion, sanityFile, user } from "../interfaces";
import { MdAdd, MdAddCircle, MdArrowBack, MdOutlineContentCopy, MdOutlineSave, MdOutlineUploadFile } from "react-icons/md";
import Select from 'react-select';
import Error from '../components/error';
import { useSession } from "next-auth/react";
import ArticleList from "../components/article-list";
import Modal from "../components/modal";
import moment from "moment";
import { TiDeleteOutline } from "react-icons/ti";

export default function DashboardPage() {
  const { data: session } = useSession();
  const user = session?.user as user;
  const [file, setFile] = useState<File>();
  const [fileSanity, setFileSanity] = useState<sanityFile>();
  const [categories, setCategories] = useState<category[]>([]);
  const [uArts, setUArts] = useState([]);

  const [showArticleForm, setShowArticleForm] = useState(false);

  // from sanity
  const [authors, setAuthors] = useState<author[]>([]);
  // added by user
  const [addedAuthors, setAddedAuthors] = useState<author[]>([]);
  // the 2 above combined
  const [allAuthors, setAllAuthors] = useState<author[]>([]);

  const [showNewAuthor, setShowNewAuthor] = useState(false);

  const [newAuthorsCount, setNewAuthorsCount] = useState(1);
  const [selectedAuthors, setSelectedAuthors] = useState<author[]>([]);

  const [error, setError] = useState('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingIa, setLoadingIa] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const [questions, setQuestions] = useState<chatQuestion[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [sub, setSub] = useState({
    subscription: 'FREE',
    renewal: '',
  });

  useEffect(() => {
    (async () => {
      const authors = await getAllAuthors();
      setAuthors(authors);
      const categories = await getAllCategories();
      setCategories(categories);
      const userArticles = await getUserArticles(user.id);
      setUArts(userArticles);
      // console.log('DASHBOARD', session);

      const getresponse = await fetch(`/api/userdownload?id=${user.id}`, {
        method: 'GET',
      });
  
      const info = (await getresponse.json())?.info
      // console.log('INFO', info);

      setSub(info);
      setLoadingSubs(false);
    })()
  }, []);

  useEffect(() => {
    const data = [
      ...addedAuthors,
      ...authors,
    ]
    setAllAuthors(data);
  }, [authors, addedAuthors]);

  // SUBIR NUEVO ARCHIVO
  const changeHandler = async (event: React.FormEvent) => {
    setLoadingFile(true);
    const files = (event.target as HTMLInputElement).files

    if (!files?.length) return;

    if (files[0].size > 33554432) {
      setError(`The file cannot exceed 32mb.%${Math.random()}`);
      setLoadingFile(false);
      return;
    }

    if (files[0].type !== 'application/pdf') {
      setError(`Only PDF files supported.%${Math.random()}`);
      setLoadingFile(false);
      return;
    }

    let newFile = await saveNewFile(files[0]);

    // console.log('NEW FILE', newFile);

    if (newFile._createdAt !== newFile._updatedAt) {
      const res = await deleteArticle(newFile._id)
      if (res) {
        newFile = await saveNewFile(files[0]);
      } else {
        (event.target as HTMLInputElement).value = '';
        setError(`The uploaded file already exists in The Digital Repo.%${Math.random()}`);
        setLoadingFile(false);
        return;
      }
    };

    const header = {
      "x-api-key": "sec_NOsCAIouaIcifJFcrgvPaqZY15V7mSqH",
      "Content-Type": "application/json",
    };

    const data = {
      url: newFile?.url,
    };

    // SUBIR EL PDF A CHATPDF
    const response = await fetch('https://api.chatpdf.com/v1/sources/add-url', {
      method: 'POST',
      headers: header,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      const data = {
        sourceId: result.sourceId,
        messages: [{
          role: "user",
          content: "Contains information related to technology?"
        }]
      }

      const reply = await fetch('https://api.chatpdf.com/v1/chats/message', {
        method: 'POST',
        headers: header,
        body: JSON.stringify(data),
      })

      if (reply.ok) {
        const pdfRes = (await reply.json()).content;
  
        // console.log(pdfRes);
        
        if (!(pdfRes.includes('Si') || pdfRes.includes('Sí') || pdfRes.includes('si') || pdfRes.includes('sí'))) {
          await deleteArticle(newFile._id);
          (event.target as HTMLInputElement).value = '';
          setError(`The document does not contain information related to technology.%${Math.random()}`);
          setLoadingFile(false);
          return;
        }
      } else {
        await deleteArticle(newFile._id);
        (event.target as HTMLInputElement).value = '';
        setError(`Error, please try again.%${Math.random()}`);
        setLoadingFile(false);
        return;
      }
    } else {
      await deleteArticle(newFile._id);
      (event.target as HTMLInputElement).value = '';
      setError(`Error, please try again.%${Math.random()}`);
      setLoadingFile(false);
      return;
    }

    setFile(files[0]);
    setFileSanity(newFile);
    setLoadingFile(false);
  }

  const addNewAuthor = () => {
    const firstnameEl = document.getElementById('firstname') as HTMLInputElement;
    const lastnameEl = document.getElementById('lastname') as HTMLInputElement;
    const firstname = firstnameEl?.value;
    const lastname = lastnameEl?.value;

    setAddedAuthors([{ _id: `new-author-${newAuthorsCount}`, firstname: firstname, lastname: lastname }, ...addedAuthors]);
    setNewAuthorsCount(newAuthorsCount + 1);

    firstnameEl.value = '';
    lastnameEl.value = '';

    setShowNewAuthor(false);
  }

  const updateSelectedAuthors = (selected: any) => {
    setSelectedAuthors(selected);
  }

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    setLoadingSave(true);
    e.preventDefault();
    // const form = e.currentTarget;
    // console.log('FORM', form);
    const formData = new FormData(e.currentTarget);

    // console.log('selected authors', selectedAuthors);

    if (!fileSanity?._id) {
      setError(`Please upload a PDF file to continue.%${Math.random()}`);
      setLoadingSave(false);
      return;
    }

    if (!selectedAuthors.length) {
      setError(`Select or add at least one author.%${Math.random()}`);
      setLoadingSave(false);
      return;
    }

    let keywords = formData.get('keywords')?.toString().split(',');
    if (!keywords || keywords.length < 3) {
      setError(`Enter at least 3 keywords separated by comma ","%${Math.random()}`);
      setLoadingSave(false);
      return;
    }

    keywords = keywords.map((x) => x.trim());

    const source = formData.get('source')?.toString()

    const newArticle: article = {
      title: formData.get('title')?.toString() ?? '',
      date: formData.get('date')?.toString() ?? '',
      authors: selectedAuthors,
      source: source?.length ? source : undefined,
      category: formData.get('category')?.toString() ?? '',
      abstract: formData.get('abstract')?.toString() ?? '',
      fileId: fileSanity._id,
      keywords: keywords,
      userId: user.id.toString(),
    }

    // console.log(newArticle);

    const savedArticle = await saveNewArticle(newArticle);

    // console.log(savedArticle);

    if (savedArticle._id) {
      // form.reset();
      const response = await fetch(`/api/email`, {
        method: 'POST',
        body: JSON.stringify({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          docTitle: newArticle.title,
        }),
      });

      window.location.reload();
    }
  }

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // const emailTest = async() => {
  //   const response = await fetch(`/api/email`, {
  //     method: 'POST',
  //     body: JSON.stringify({
  //       firstname: user.firstname,
  //       lastname: user.lastname,
  //       email: user.email,
  //     }),
  //   });
  // }

  const qs = [
    {
      name: 'Title',
      value: 'what is the title of the document?',
      response: ''
    },
    {
      name: 'Abstract',
      value: 'what is the document about?',
      response: ''
    },
    {
      name: 'keywords',
      value: 'Extract three keywords from the document separated by comma',
      response: ''
    }
  ]

  // define the function to make the POST request
  const analyzeDocument = async () => {
    setLoadingIa(true);
    const header = {
      "x-api-key": "sec_NOsCAIouaIcifJFcrgvPaqZY15V7mSqH",
      "Content-Type": "application/json",
    };

    const data = {
      url: fileSanity?.url,
    };

    // SUBIR EL PDF A CHATPDF
    const response = await fetch('https://api.chatpdf.com/v1/sources/add-url', {
      method: 'POST',
      headers: header,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      // console.log('PDF RESPONSE', result);

      // ----------------------------------------------
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i].value;
        const data = {
          sourceId: result.sourceId,
          messages: [{ role: "user", content: q }]
        }

        const reply = await fetch('https://api.chatpdf.com/v1/chats/message', {
          method: 'POST',
          headers: header,
          body: JSON.stringify(data),
        })

        qs[i].response = (await reply.json()).content;
        // console.log(`${i} question`, qs[i].response);
      }
    }

    setQuestions(qs);
    setLoadingIa(false);
  }

  const handleUploadButton = () => {
    if (user.subName.includes('PREMIUM')) {
      setShowArticleForm(true);
      return;
    }

    let limit = 1;
    if (user.subName.includes('BASIC')) {
      limit = 20;
    }

    if (uArts.length >= limit) {
      setShowModal(true);
      return;
    }

    setShowArticleForm(true);
  }

  const deleteFile = (e: any) => {
    const input = (document.getElementById('dropzone-file') as HTMLInputElement);
    if (input) input.value = '';
    setFile(undefined);
  }

  return (
    <main className="grow bg-cyan-50">
      <div className={`pt-36 md:pt-28 pb-10 px-10 ${showArticleForm ? 'hidden' : ''}`}>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl mt-3 md:mt-0 py-2 capitalize px-4 text-black bg-gradient-to-r from-indigo-200 from-10%  via-sky-200 via-30% to-teal-200 rounded-2xl w-fit">
            Hello, {`${user.firstname || ''} `}
          </h2>
          <div className="capitalize text-navy text-lg py-2">
            Subscription: {user?.subName ?? 'FREE'} {user.expiryDate && `(vence: ${moment(user.expiryDate).format('DD-MM-YYYY')})`}
          </div>
          <button
            className="flex items-center gap-1 rounded-lg bg-navy hover:bg-cyan-500 text-white p-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUploadButton}
            disabled={loadingSubs}
          >
            <span className="text-2xl"><MdAdd /></span>
            <span className="pr-2">Upload document</span>
          </button>
        </div>
        <div>
          <h2 className='mt-10 font-bold text-2xl'>Published articles</h2>
          <div className="border-b border-b-navy"></div>
          {uArts.length > 0 &&
            <ArticleList articles={uArts.filter((x: any) => x.approved)} />
          }
          {!uArts.find((x: any) => x.approved) &&
            <p className="text-lg py-8 text-gray-500 text-center">No published articles yet. Click on upload document to start.</p>
          }
        </div>
        <div>
          <h2 className='mt-10 font-bold text-2xl'>Articles pending approval</h2>
          <div className="border-b border-b-navy"></div>
          {uArts.length > 0 &&
            <ArticleList articles={uArts.filter((x: any) => !x.approved)} />
          }
          {!uArts.find((x: any) => !x.approved) &&
            <p className="text-lg py-8 text-gray-500 text-center">No articles pending approval.</p>
          }
        </div>
      </div>
      <div
        className={`flex items-center flex-wrap justify-between pt-40 md:pt-28 px-5 md:px-10 gap-y-5 ${!showArticleForm ? 'hidden' : ''}`}
      >
        <div className="text-xl">Create new document</div>
        <div className="flex items-center cursor-pointer hover:text-gray-500" onClick={() => setShowArticleForm(false)}>
          <MdArrowBack /><span className="pl-2">Volver</span>
        </div>
        <div className="text-sm">Upload a PDF file or Link to a website that is related to the tech world, from gadgets, AI, software development and state of the art.</div>
      </div>
      <div className={`flex flex-col-reverse md:flex-row w-full pb-10 ${!showArticleForm ? 'hidden' : ''}`}>
        <form className="flex flex-wrap justify-between gap-10 p-5 md:p-10 basis-1/2" onSubmit={submitHandler}>
          <div className="flex flex-col items-center justify-center w-full relative">
            {file && <span className="absolute top-2 right-2 w-5 h-5 hover:text-red-600 text-xl cursor-pointer" onClick={deleteFile}><TiDeleteOutline /></span>}
            <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-100 ${loadingFile ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <span className="text-[35px] pb-4 text-gray-500"><MdOutlineUploadFile /></span>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click here</span> to upload a file</p>
                <p className="text-xs text-gray-500">PDF only (MAX. 32Mb)</p>
                {file && <span className="text-sm text-green-500 pt-5">{file.name}</span>}
                {loadingFile && <div className="w-6 h-6 mt-4 border-4 border-dashed rounded-full animate-spin border-navy"></div>}
              </div>
              <input id="dropzone-file" type="file" className="hidden" name="file" onChange={changeHandler} disabled={loadingFile} />
            </label>
            <button type="button"
              className="flex items-center justify-center p-3 border bg-white border-cyan-400 hover:[&:not(:disabled)]:bg-cyan-100 rounded-lg w-full my-4 hover:[&:not(:disabled)]:bg-gradient-to-r hover:[&:not(:disabled)]:from-cyan-300 hover:[&:not(:disabled)]:to-purple-300 hover:[&:not(:disabled)]:text-white disabled:border-gray-400 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={fileSanity && !loadingIa ? false : true}
              onClick={analyzeDocument}
            >
              Analizar archivo con IA
              {loadingIa && <div className="w-6 h-6 ml-4 border-4 border-dashed rounded-full animate-spin border-navy"></div>}
            </button>
          </div>
          <div className="flex flex-col justify-start w-full">
            <div className="flex flex-col items-start gap-2 my-2 w-full">
              <label htmlFor="title">Title</label>
              <input type="text" name="title" maxLength={1000} required placeholder="Enter the document's title"
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg w-full invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
              />
            </div>
            <div className="flex flex-col items-start gap-2 my-2">
              <label htmlFor="author">Author</label>
              <div className={`flex items-center w-full${!showNewAuthor ? ' hidden' : ''}`}>
                <input type="text" id="firstname" name="firstname" placeholder="First name" maxLength={45}
                  className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg mr-2 grow invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                />
                <input type="text" id="lastname" name="lastname" placeholder="Last name" maxLength={45}
                  className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg grow invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500"
                />
                <button type="button" className="ml-3 text-[28px]" onClick={addNewAuthor}>
                  <MdOutlineSave />
                </button>
              </div>
              <div className={`flex items-center w-full${showNewAuthor ? ' hidden' : ''}`}>
                <Select
                  defaultValue={addedAuthors[-1]}
                  isMulti
                  name="authors"
                  options={allAuthors}
                  className="basic-multi-select w-full"
                  classNamePrefix="select"
                  placeholder="Select an author"
                  onChange={updateSelectedAuthors}
                  getOptionValue={(option) => option._id}
                  getOptionLabel={(option) => `${option.firstname ?? ''} ${option.lastname ?? ''}`}
                />
                <button type="button" className="ml-3 text-[28px]" onClick={() => setShowNewAuthor(true)}>
                  <MdAddCircle />
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start gap-2 my-2 w-full">
              <label htmlFor="date">Year of publication</label>
              <input
                type="number" name="date" min="1950" max="2050" defaultValue="2023" required
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg"
              />
              {/* <input type="date" name="date" max={new Date().toISOString().split('T')[0]} min={new Date(1950, 0, 1).toISOString().split('T')[0]} required className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg" /> */}
            </div>
            <div className="flex flex-col items-start gap-2 my-2 w-full">
              <label htmlFor="abstract">Abstract</label>
              <textarea name="abstract" id="abstract-textarea" cols={30} rows={10} required
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg w-full"></textarea>
            </div>
            <div className="flex flex-col items-start gap-2 my-2 w-full">
              <label htmlFor="source">URL (optional)</label>
              <input type="url" name="source" placeholder="Ingrese la fuente del documento"
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg w-full"
              />
            </div>
            <div className="flex flex-col items-start gap-2 my-2 w-full">
              <label htmlFor="category">Category</label>
              <select name="category" id="category-select" className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg grow" required>
                <option value="">Select category</option>
                {categories.map((cat) => {
                  return (
                    <option key={cat._id} value={cat._id}>{cat.name} ({cat.type})</option>
                  )
                })}
              </select>
            </div>
            <div className="flex flex-col items-start gap-2 my-2 w-full">
              <label htmlFor="source">Keywords</label>
              <input type="text" name="keywords" placeholder='Enter at least 3 keywords separated by comma'
                className="border border-gray-400 focus:border-gray-600 p-2 rounded-lg w-full" required
              />
            </div>
            <button type="submit"
              className="flex items-center justify-center p-3 border border-cyan-400 hover:bg-cyan-100 transition-opacity rounded-lg w-full my-6 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingSave}
            >
              Submit Document
              {loadingSave && <div className="w-6 h-6 ml-4 border-4 border-dashed rounded-full animate-spin border-navy"></div>}
            </button>
          </div>
        </form>
        {questions.length > 0 &&
          <div className="flex flex-col grow-0 md:w-1/2 p-8 m-5 md:m-3 md:mr-5 md:mt-10 rounded-xl bg-gradient-to-r from-cyan-300 to-purple-300 h-fit">
            <h2 className="font-bold pb-4 uppercase">Suggested AI results</h2>
            {questions.map((q, i) => {
              return (
                <div key={i} className="flex flex-col py-4">
                  <div className="pb-3 font-semibold flex items-center gap-x-3">
                    {q.name}
                    <span className="cursor-pointer" onClick={() => { copy(q.response) }}><MdOutlineContentCopy /></span>
                  </div>
                  <span className="">{q.response}</span>
                </div>
              )
            })}
          </div>
        }
      </div>
      {!!error.length && <Error msg={error} isVisible={true} />}
      {showModal && <Modal setShowModal={setShowModal} userId={user.id}/>}
    </main>
  )
}
