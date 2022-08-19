import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { HomeIcon, SearchCircleIcon, ChatAlt2Icon, CogIcon } from '@heroicons/react/outline'
import Head from 'next/head'
const StudySidebar = (props) => {
  const router = useRouter()
  const {query} = useRouter()
 
  return (
    <>
    <Head>
      <title>Study | {router.pathname == '/dashboard/study/flashcards' ? "Flashcards" : ""} {router.pathname == '/dashboard/study/quizes' ? "Quizes" : ""} {router.pathname == '/dashboard/study/quickstudy' ? "QuickStudy" : ""}</title>
      <link rel="icon" href="https://i.ibb.co/sb2psmq/justlogo-removebg-preview-3.png"/>
    </Head>
    <div className='flex flex-col overflow-y-auto bg-gray-800 '>
      <div>
        <div className='flex flex-col justify-around w-auto px-4 cursor-pointer'>
          <a class={router.pathname == '/dashboard/study/flashcards' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"} href={"/dashboard/study/flashcards?id="+query.id}>Flashcards</a>
          <a class={router.pathname == '/dashboard/study/quizes' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"} href="/dashboard/study/quizes">Quizes</a>
          <a class={router.pathname == '/dashboard/study/quickstudy' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"} href={"/dashboard/study/quickstudy?id="+query.id}>Quick Study</a>
        </div>
        </div>
    </div>
    </>
  )
}

export default StudySidebar