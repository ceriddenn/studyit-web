import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import Loading from '../../components/Loading'
import Sidebar from '../../components/Sidebar'
import supabase from '../../lib/supabase'
import {MinusCircleIcon} from '@heroicons/react/outline'
import DataHelper from '../../components/DateHelper'
import {toast, ToastContainer} from 'react-toastify'
import Head from 'next/head'
const profile = () => {
  const router = useRouter()
  const {query} = useRouter()
  const userID = query.id;
  const session = supabase.auth.session()
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userDeck, setUserDeck] = useState(0)
  const [decks, setDecks] = useState([])
  const [sessionId, setSessionId] = useState('')
  const [badges, setBadges] = useState([{}])

  const delay = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() =>{
    setLoading(true)
    if (!session && !session.user) {
      router.push('/login')
    }
    if(!router.isReady) return;
    const query1 = async () => {
      const array = []
    await supabase.from('Profile').select('*').match({id:userID}).then(async res => {
      if (res.error) {
        toast.error("Error getting user's data. If this re-occurs please contact support@studyit.ml")
        return;
      }
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
    await supabase.from('StudyDeck').select('*').match({deckOwner:userID}).then(async res => {
      if (res.error) {
        toast.error("Error getting user's decks. If this re-occurs please contact support@studyit.ml")
        await delay(2000)
        toast.warning("Redirecting you to the dashboard now...")
        await delay(5000)
        router.push('/dashboard/home')
        return;
      }
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

  const changePfp = async (event) => {
    event.preventDefault()
    const files = event.target.files;
    const file = files[0];
    if (!file.name.match(/.(jpg|jpeg|png|gif)$/i)) {
      toast.error("Please upload a file that ends in .jpg, .jpeg, .png or .gif")
      return;
    }
    getBase64(file)
  }
  const onLoad = async (fileString) => {
    await supabase.from('Profile').update({avatarURL: fileString}).match({id:session.user.id}).then(async res => {
      if (res.error) {
        toast.error("Error updating your profile picture.")
      } else {
        toast.success("Profile picture updated successfully.")
        window.location.reload()
      }
    })
  }
  const getBase64 = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      onLoad(reader.result)
    }
  }

  return (
    <>
        <Head>
        <title>StudyIt | MyProfile</title>
        <link rel="icon" href="https://i.ibb.co/sb2psmq/justlogo-removebg-preview-3.png"/>
      </Head>
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
                            <div className='flex flex-row'>
                          <div className='flex flex-col'>
                          <h1 className='text-white font-semibold text-md ml-4 mt-2 pr-2'>Profile Info</h1>

                          <img className='border-1 border-blue-600 h-24 w-24 rounded-full ml-4 mb-2 mt-2' alt='' src={userData.avatarURL && userData.avatarURL}/>
                          <label className='px-4 py-2 bg-blue-600 ml-4 rounded-md cursor-pointer text-md mt-2'>
                            Upload Avatar
                          <input type="file" onChange={event => changePfp(event)} className="hidden"/>
                          </label>
                          <h1 className='px-4 py-2 font-semibold mb-1'>Badges</h1>
                          </div>
                          
                        </div>
                        
                        </div>
                        <div className='flex flex-row flex-wrap'>
                          {badges.length > 0 && badges.map(badge => {
                            return (
                              
                          <div class="mb-4 ml-4">
                              <span class="bg-cyan-700 rounded-full px-3 py-1 text-sm font-semibold text-white mb-2">{badge.name ? badge.name :  "No Badges Found"}</span>
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
        <div className="flex flex-row flex-wrap mt-8 bg-gray-700 shadow-sm rounded-lg ml-8 mt-2 mr-8 mb-4">
        {decks.map(d => {
      return (
        <div className='pr-4 mt-4 p-3'>
        <div key={d.deckId}>
          <div class="flex justify-left">
  <div class="block rounded-lg shadow-lg bg-gray-800 max-w-sm">
    <div class="p-6">
      <div class="flex flex-row">
      <h5 class="text-white text-xl font-medium mb-2">{d.deckName}</h5>
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
        </div>}
        <ToastContainer theme="colored" position="bottom-right"/>

    </>
  )
}

export default profile