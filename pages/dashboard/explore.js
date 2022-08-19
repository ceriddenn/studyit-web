import React, {useState, useEffect} from 'react'
import Sidebar from '../../components/Sidebar'
import supabase from '../../lib/supabase'
import 'react-toastify/dist/ReactToastify.css'
import {toast, ToastContainer} from 'react-toastify'
import { useRouter } from 'next/router'
import Head from 'next/head'
import {MinusCircleIcon} from '@heroicons/react/outline'
import DataHelper from '../../components/DateHelper'
import { getSourceMapRange } from 'typescript'
import Userlib from '../../lib/Userlib'
import Loading from '../../components/Loading'
const explore = () => {
    const router = useRouter()
    const session = supabase.auth.session()
    const [loading, setLoading] = useState(false)
    const [decks, setDecks] = useState([])
    const findSomeone = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        await supabase.from('Profile').select('*').match({username:username}).then(res => {
            if (!res.data[0]) {
                toast.error('There was no user found with that username!')
            } else {
                router.push('/dashboard/profile?id=' + res.data[0].id)
            }
        })
    }
    useEffect(() => {
        setLoading(true)
        async function query() {
            const array1 = []
            await supabase.from('StudyDeck').select('*').match({isDeckPublic: true}).then(res => {
                const ed = res.body
                ed.forEach(deck => {
                array1.push(deck)
            })
        })
        setDecks(array1)

        setLoading(false)

    }
        query()
    },[])
  return (
    <>
        <Head>
        <title>StudyIt | Explore</title>
        <link rel="icon" href="https://i.ibb.co/sb2psmq/justlogo-removebg-preview-3.png"/>
      </Head>
      {loading ? <Loading/> : 
    <div className="flex">
        {/* sidebar */}
        <Sidebar/>
        <div className="bg-gray-300 min-h-screen w-full h-full overflow-y-auto relative p-8">
            <h1 className='p-3 pt-8 text-black font-semibold text-2xl'>Community Decks</h1>
            <div className="flex flex-row flex-wrap overflow-hidden">

        {decks && decks.map(d => {
      return (
        <div className='pr-4 mt-4 p-3' key={d.deckId}>
        <div key={d.deckId}>
          <div class="flex justify-left">
  <div class="block rounded-lg shadow-lg bg-gray-800 max-w-sm">
    <div class="p-6">
      <div class="flex flex-row">
      <h5 class="text-white text-xl font-medium mb-2">{d.deckName}</h5>
      <MinusCircleIcon className="h-6 w-6 text-blue-600 mt-1 ml-2 cursor-pointer hover:text-blue-700 transition ease-in-out delay-150 hover:scale-110"/>
      </div>
      <p class="text-gray-500 text-base mb-4">
        {d.description}
      </p>
      <button type="button" class=" inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-yellow-500 transition duration-150 ease-in-out" onClick={() => {router.push('/dashboard/study/flashcards?id=' + d.deckId)}}>Study</button>
    </div>
    <p class="text-gray-500 text-base mb-4">
        <span className='ml-6 text-yellow-400'>Created By: <Userlib user={d.deckOwner}/></span>
      </p>
    <div class="py-3 px-6 border-t border-blue-600 text-gray-600">
    <DataHelper date={d.created_at}/>
    </div>
  </div>
</div>
</div>
</div>
      )
    })}
    </div>
            <div className="absolute top-0 right-0">
            <form onSubmit={event => findSomeone(event)}>
            <input type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4 mr-4" placeholder="Find Someone"/>
            <button class="bg-yellow-400 text-white border border-solid border-6 border-yellow-400 rounded-lg py-2 px-2 mr-4">Go!</button>
            </form>
            </div>
        </div>
        <ToastContainer theme="colored" position="bottom-right"/>

    </div>}
    </>
  )
}

export default explore