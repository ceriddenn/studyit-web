import React, {useState, useEffect} from 'react'
import supabase from '../../../lib/supabase'
import {toast, ToastContainer} from 'react-toastify'
import Sidebar from '../../../components/Sidebar'
import StudySidebar from '../../../components/StudySidebar'
import { useRouter } from 'next/router'
import Loading from '../../../components/Loading'
const flashcards = () => {
    const router = useRouter()
    const {query} = useRouter()
    const userID = query.id;
    const [contents, setContents] = useState([{}])
    const [deckMeta, setDeckMeta] = useState([{}])
    const [showBack, setShowBack] = useState(false)
    const [num, setNum] = useState(0)
    const [isDone, setIsDone] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        if (!router.isReady) return
        setLoading(true)
        const query = async () => {
            const array1 = []
            const array2 = []
            await supabase.from('StudyDeck').select('*').match({deckId:userID}).then(res => {
                array2.push(res.data[0])
                res.data[0].contents.map(c => {
                    array1.push(c)
                })
            })
            setContents(array1)
            setDeckMeta(array2)
            setLoading(false)
    }
        query()
    },[router.isReady])
    const nextQuestion = (event) => {
        event.preventDefault()
        setShowBack(false)
        if (num > contents.length -2) {
            setIsDone(true)
            // add 1 more so when we go back it doesnt go back 2 due to the "done screen" acting like a ghost
            setNum(num + 1)
            return;
        } else {
            setNum(num+1)
        }
    }
    const prevQuestion = (event) => {
        event.preventDefault()
        setIsDone(false)

        if (num === 0) {
            alert('beginning of deck')
         } else {
            setNum(num-1)
         }
    }
    const toggleBack = (event) => {
        event.preventDefault()
        if(showBack) {
            setShowBack(false)
        } else {
            setShowBack(true)
        }
    }
  return (
    <>
    {loading ? <Loading /> :
    <div className='flex'>
        <Sidebar id={userID}/>
        <div class="container mx-auto h-screen w-full overflow-x-hidden overflow-y-hidden">
            <div className='pt-8 pl-8'><span className='text-black text-2xl font-extrabold'>Studying: <span className='text-blue-600 text-2xl font-extrabold'>{deckMeta[0].deckName}</span> on <span className='text-yellow-400 text-2xl font-extrabold'>FlashCards</span></span></div>
        <div class="flex items-center justify-center h-full">
        <button className='py-4 px-4 bg-yellow-400 text-white rounded-lg mb-16 mr-6 hover:scale-105 transition ease-in-out cursor-pointer' onClick={event => {prevQuestion(event)}}>Prev</button>

            <div class="bg-gray-800 shadow-2xl p-6 rounded-2xl border-2 border-gray-50 mb-16 hover:scale-110 cursor-pointer transition ease-in-out" onClick={event => {toggleBack(event)}}>
                <div class="flex flex-col">
                    <div class="my-6">
                        <div class="flex flex-col space-x-4 items-center">
                            {!isDone ?
                            <h1 className='text-white text-2xl font-extrabold'>{!showBack ? contents[num] && contents[num].term : contents[num] && contents[num].definition}</h1> :
                            <h1 className='text-white text-2xl font-extrabold '>This is the end. <span className='text-blue-600 text-2xl font-extrabold underline cursor-pointer' onClick={event => {setIsDone(false); window.location.reload(); setShowBack(false);}}>Repeat?</span></h1>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <button className='py-4 px-4 bg-yellow-400 text-white rounded-lg mb-16 ml-6 hover:scale-105 transition ease-in-out cursor-pointer' onClick={event => {nextQuestion(event)}}>Next</button>
        </div>
    </div>
    </div>}
    </>
  )
}

export default flashcards