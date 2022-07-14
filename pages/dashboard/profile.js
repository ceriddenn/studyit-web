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
  const session = supabase.auth.session()

  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(false)
  const [userDeck, setUserDeck] = useState(0)
  const [decks, setDecks] = useState([])
  
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

  const changePassword = async (event) => {
      event.preventDefault()
      const query = await fetch('https://InnocentFlakyConversions.ceriddennteam.repl.co/sendresetemail', {
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                email: session.user.email,
              }),
              method: 'POST',
  
              
            })
            const result = await query.json()
            if (result.error == null) {
              toast.success(result.message)
            } else {
              toast.error(result.error)
            }
    
          }

          const updateEmail = async (email) => {
            const request = await fetch('https://InnocentFlakyConversions.ceriddennteam.repl.co/change_email', {
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                newEmail: email,
                userId: session.user.id,
              }),
              method: 'POST',

          })
          const result = await request.json()
          if (result.error == null) {
            toast.success(result.message)
          } else {
            toast.error(result.error)
          }
          await supabase.from('Profile').update({email: email}).match({id:session.user.id}).then(res => {
            // error handling here
          })
        }
        const updateUserName = async (username) => {
          await supabase.from('Profile').update({username: username}).match({id:session.user.id}).then(res => {

          })
        }
          
      const updateUserMeta = async (event) => {
        event.preventDefault()
        if (!event.target.email.value) {
          updateUserName(event.target.username.value)
        } else if (!event.target.username.value) {
          updateEmail(event.target.email.value)
        } else {
          updateUserName(event.target.username.value)
          updateEmail(event.target.email.value)
        }
      }

  return (
    <>
    {loading ? <Loading/> : 
    <div className="flex">
      {/* sidebar */}
      <Sidebar/>
      <div className="">
        {/* profile content here */}
        <h1 className="text-2xl pt-8 pl-8 font-semibold">{userData.username}'s Profile</h1>
        
        <div className="flex flex-row grow">
        <img src={userData.avatarURL} className=" ml-8 mt-6 mr-2 border border-2 border-blue-500 rounded-full"/>

        <div className="flex flex-col flex-nowrap mt-6 ml-8 mr-4 box-border h-48 w-full p-4 border-2 border-gray-500 bg-gray-800 rounded-md">
          <div className="">
            <form onSubmit={event => updateUserMeta(event)}>
            <div className="flex flex-row shrink-0">
          <h1 className="font-bold text-white pt-2">Change Username</h1>
          <input type="text" id="username" placeholder={userData.username} className="bg-gray-500 text-white border-2 border-gray-600 rounded-md ml-2 px-2 py-2"/>
          <h1 className="font-bold text-white pt-2 ml-4">Change Email</h1>
          <input type="text" id="email" placeholder={userData.email} className="bg-gray-500 text-white border-2 border-gray-600 rounded-md ml-2 px-2 py-2"/>
          <button className='text-white ml-2 py-2 px-2 bg-yellow-400 hover:bg-yellow-500 rounded-md'>Change</button>
          </div>
          </form>
          <div class="flex">
          <div class="-ml-0.5 w-0.5 h-6 bg-gray-600"></div>
            <div className="font-bold pl-1 text-white flex flex-col">
            <h1 className="font-bold text-white">Badges:</h1>
              <div className="flex flex-row flex-wrap">
                {badges.map(badge => {
                  return (
                    <div className="">
                  <span class="bg-green-100 text-green-800 text-xs font-semibold mr-2  px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900">{badge.badge}</span>
                  </div>
                  )
                })}
              </div>
            </div>

              </div>
          </div>

          <h1 className="font-bold text-white pt-2">Database ID: {userData.id}</h1>
          <div className="flex flex-row">
          <h1 className="font-bold text-white pt-2">Deck Count: {userDeck}</h1>
          <h1 className="font-bold underline text-blue-500 pt-2 pl-2 cursor-pointer" onClick={event => changePassword(event)}>Change Password?</h1>
          </div>
        </div>

        </div>
        <div className="">
        <h1 className="font-bold text-2xl ml-12 mt-6">{userData.username}'s Decks</h1>
        </div>
        <div className="flex flex-row flex-wrap mt-8">
        {decks.map(d => {
      return (
        <div key={d.deckId}>
          <div class="flex justify-left pl-12 pb-4">
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