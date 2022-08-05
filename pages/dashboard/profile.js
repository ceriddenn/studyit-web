import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import supabase from '../../lib/supabase'
import {MinusCircleIcon} from '@heroicons/react/outline'
import DataHelper from '../../components/DateHelper'
import {toast, ToastContainer} from 'react-toastify'
const profile = () => {
  const router = useRouter()
  const {query} = useRouter()
  const userID = query.id;

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userDeck, setUserDeck] = useState(0)
  const [decks, setDecks] = useState([])
  const [sessionId, setSessionId] = useState('')
  const [badges, setBadges] = useState([{}])
  useEffect(() =>{
    setLoading(true)

    if(!router.isReady) return;
    const query1 = async () => {
      const array = []
    await supabase.from('Profile').select('*').match({id:userID}).then(res => {
      setUserData(res.data[0])
      res.data[0].badges.forEach(bad => {
        array.push(bad)
      })
      setBadges(array)

    })
  }
  query1()
  const sessi = supabase.auth.session()
  setSessionId(sessi.user.id)
  const query2 = async () => {
    const array = []
    await supabase.from('StudyDeck').select('*').match({deckOwner:userID}).then(res => {
      res.data.forEach(d => {
        array.push(d)
        setUserDeck(userDeck + 1)

      })
      setDecks(array)
      setLoading(false)

    })
  }
  query2()
  }, [router.isReady])


  return (
    <>
    {loading ? <Loading/> : 
    <div className="flex">
      {/* sidebar */}
      <Sidebar/>
      <div className="">
        {/* profile content here */}
        <h1 className="text-2xl pt-8 pl-8 font-semibold">{userID != sessionId ? userData.username + "'s Profile" : "My Profile"}</h1>
        
        <div className="flex flex-row">
          {/* Profile Card Here */}
      <div class="max-w-5xl bg-gray-800 p-3 shadow-sm rounded-lg ml-8 mt-2 relative flex flex-col">
                    <div class="flex items-center space-x-2 font-semibold text-white leading-8">
                        <span clas="text-green-500">
                            <svg class="h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </span>
                        <span class="tracking-wide">About</span>
                    </div>
                    <div class="text-white grow-0">
                        <div class="grid md:grid-cols-2 text-sm">
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">First Name</div>
                                <div class="px-4 py-2">{userData && userData.firstname}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Last Name</div>
                                <div class="px-4 py-2">{userData && userData.lastname}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">My UserId</div>
                                <div class="px-4 py-2">{userData && userData.id}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Has Created</div>
                                <div class="px-4 py-2">{userData && decks.length + " Decks"}</div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Email</div>
                                <div class="px-4 py-2">
                                    <a class="text-blue-800">{userData && userData.email}</a>
                                </div>
                            </div>
                            <div class="grid grid-cols-2">
                                <div class="px-4 py-2 font-semibold">Username</div>
                                <div class="px-4 py-2">{userData && userData.username}</div>
                            </div>
                        </div>
                        <div className='flex flex-row'>
                          <div className='flex flex-col'>
                          <h1 className='text-white font-semibold text-md ml-4 mt-2'>Profile Info</h1>
                          <img className='border-1 border-blue-600 h-24 w-24 rounded-full ml-2 mt-2' alt='' src='https://cdn.vox-cdn.com/thumbor/QAlwO040t1-7mFhTs9oYtXdIwAo=/0x0:1920x1080/1200x800/filters:focal(807x387:1113x693)/cdn.vox-cdn.com/uploads/chorus_image/image/71100308/kirby.0.jpg'/>
                          </div>
                          {badges && badges.map(badge => {
                            return (
                          <div class="px-6 pt-4 pb-2">
                              <span class="inline-block bg-yellow-400 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{badge.name ? badge.name :  "No Badges Found"}</span>
                          </div>
                            )
                        })}
                        </div>
                    </div>
                </div>
                </div>

        <div className="">
        <h1 className="font-semibold text-2xl ml-8 mt-6">{userID != sessionId ? userData.username + "'s Decks" : "My Decks"}</h1>
        </div>
        <div className="flex flex-row flex-wrap mt-8 bg-gray-700 p-3 shadow-sm rounded-lg ml-8 mt-2 mr-8 mb-4">
        {decks.map(d => {
      return (
        <div className='pr-4 mt-4'>
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
        </div>
        <ToastContainer theme="colored" position="bottom-right"/>
        </div>}
    </>
  )
}

export default profile