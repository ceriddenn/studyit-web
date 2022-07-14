import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import { HomeIcon, SearchCircleIcon, ChatAlt2Icon, CogIcon } from '@heroicons/react/outline'
const StudySidebar = (props) => {
  const router = useRouter()

  const [showDecks, setShowDecks] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)
  const [typeSelected, setTypeSelected] = useState('flashcards')
  return (
    <div className='flex flex-col overflow-y-auto bg-gray-800 '>
      <div>
        <div className='flex flex-col justify-around w-auto px-4 cursor-pointer'>
          <a class={router.pathname == '/dashboard/study/flashcards' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"} href="/dashboard/study/flashcards">Flashcards</a>
          <a class={router.pathname == '/dashboard/study/quizes' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"} href="/dashboard/study/quizes">Quizes</a>
          <a class={router.pathname == '/dashboard/study/quickstudy' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"} href="/dashboard/study/quickstudy">Quick Study</a>
        </div>
        </div>
    </div>
  )
}

export default StudySidebar