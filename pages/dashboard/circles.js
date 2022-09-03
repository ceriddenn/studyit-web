import React , {useState, useEffect}from 'react'
import { requestNewUserToken } from '../../lib/streamchat'
import {LogoutIcon, HomeIcon, CogIcon, SearchCircleIcon, ChatAlt2Icon, MinusSmIcon, PlusIcon, MinusIcon} from '@heroicons/react/outline'
import {getChannel} from '../../lib/streamchat'
import supabase from '../../lib/supabase'
import {ArrowDownIcon, ArrowRightIcon} from '@heroicons/react/outline' 
import {StreamChat} from 'stream-chat'
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
  EmptyStateIndicator,
} from 'stream-chat-react'

import  'stream-chat-react/dist/css/index.css'
import ChannelPrev from '../../components/ChannelPrev'
import Sidebar from '../../components/Sidebar'
import { BounceLoader } from 'react-spinners'
const CustomEmptyStateIndicator = () => {
  return (
    <h1 className='flex justify-center'>No circles or dms found.</h1>
  )
}
const apiKey = "283u2ftt83su"
const name = "Finnean"
const circles = () => {
  const session = supabase.auth.session()
  const [client, setClient] = useState(null)
  const [userData, setUserData] = useState([{}])
  const [channel, setChannel] = useState(null)
  const [update1, setUpdate1] = useState(true)
  const [banned, setBanned] = useState(false)

  //group creation variables
  const [createModal, setCreateModal] = useState(false)
  const [loading, setIsLoading] = useState(false)
  const [dm, setDm] = useState(false)
  const [members, setMembers] = useState([{email: null, id: Math.floor(Math.random() * 1000000) + 1}])
  const [groupName, setGroupName] = useState(null)
  const [groupIcon, setGroupIcon] = useState(null)
  const [error, setError] = useState(false)
  const delay = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    async function init() {
        const session = supabase.auth.session()

      let chatUserToken;
      let authUser;
      const chatClient = StreamChat.getInstance("283u2ftt83su")
      const id = session.user.id
      await supabase.from('Profile').select('*').match({id:id}).then(async res => {
        authUser = res.data[0]
      })
      await requestNewUserToken(id).then(async res => {
        const user = {
        id: authUser.id,
        name: authUser.username,
        image: "google.com"
      }
      await chatClient.connectUser(user, res.token)
      })
      const banned = await chatClient.queryUsers({ id: authUser.id, banned: true });
    // response will contain user object with updated users info
      if (banned.users.length === 1) {
        setBanned(true)
      } else {
        setBanned(false)
      }
      setClient(chatClient)
    }
    init()
    if (client) return () => client.disconnectUser()
  },[])
  if (!client) return (
  <div className='flex justify-center items-center h-screen flex-col pb-2'>
  <LoadingIndicator size="100"/>
  <h1 className='text-blue-600 font-semibold text-2xl'>Connecting your studyit account to our chat network!</h1>
  </div>)
  if (banned) return (
    <div className='flex justify-center items-center h-screen flex-col pb-2'>
  <h1 className='text-red-600 font-semibold text-2xl'>You have been temporarily suspended from our study group service. <br/> <h1 className='text-red-400  text-md flex justify-center'>If you think this was an error please contact appeals@studyit.ml</h1></h1>
  </div>)
  const filters = { type: 'messaging', members: { $in: [session.user.id] }}
    const sort = { last_message_at: -1 }
  const toggleCreationModal = async (event) => {
    event.preventDefault()
    setCreateModal(true)
  }
  async function createGroup(event) {
    event.preventDefault()
    if (members.length <= 0 ) {
      console.log('no members!')
      return;
    }
    var num;
    members.map(m => {
      if (m.email === null) {
        num = 1
        return;
      }
    })
    if (num === 1) {
      console.log('no members!')
      return;
    }
     if (members[0].email == null) {
      console.log('no member email... null!')
      return;
    } else if (groupName == "" || groupName == null) {
      console.log('no group name!')
      return;
    } else if (groupIcon == "" || groupIcon == null) {
      console.log('no group icon!')
      return;
    } else {
      var membersv2 = []
      const id = supabase.auth.session().user.id
       members.every(async m => {
        await supabase.from('Profile').select('*').match({email:m.email}).then(async res => {
          console.log(res.data[0].id)
          membersv2.push(res.data[0].id)
        })
      
      })
      await delay(500) // add await above later TODO
      membersv2.push(id)
      console.log("datd1111", membersv2)
      const cid = Math.floor(Math.random() * 1000000) + 1
      var type;
      if (dm) {
        console.log('running')
        if (!membersv2.length === 1 ) {
          console.log('dm mode selected but more than one member!')
          return
        }
        console.log(membersv2)
        type = "dm"
      } else {
        type = "circle"
      }
      const channel = await client.channel('messaging', cid, {
        image: groupIcon,
        name: groupName,
        members: membersv2,
        owner: id,
        mode: type
      })
      await channel.create()
      await channel.watch()
      setCreateModal(false)
    }
  }

  function addMember(event) {
    event.preventDefault()
    setMembers([...members, { email: null, id: Math.floor(Math.random() * 1000000) + 1 }])
  }
  function removeMember(event, index, id) {
    event.preventDefault()
    const values = [...members];
    values.splice(values.findIndex(value => value.id === id), 1)
    setMembers(values)
    
  }
  function updateMember(event, me, ind) {
    event.preventDefault()
    const newInputItems = members.map(m => {
      if(me.id === m.id) {
        m["email"] = event.target.value
      }
      return m
    })
    setMembers(newInputItems)
  }
  function handleDMToggle(event) {
    if (dm) {
      setDm(false)
    } else {
      setDm(true)
    }
  }

  return (
    <>
        <div className={createModal ? 'flex flex-row blur-sm' : 'flex flex-row'}>

        <div class="flex">
    <div class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gray-800 sticky top-0 left-0">
        <img class="mr-6 cursor-pointer" src="https://i.ibb.co/VMvNFzP/logo-transparent-background.png" alt="Logo"/>
      <div class="flex flex-col justify-between mt-6">
        <aside>
          <ul class="space-y-3">
            <li>
              <a class="flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4">
              <ChatAlt2Icon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Cirlces</span>
              </a>
            </li>
            <li>
              <div>
              <button onClick={event => toggleCreationModal(event)} className="text-white px-4 py-2 bg-yellow-400 rounded-md">Create new Circle</button>
              </div>
            </li>

          </ul>

        </aside>
        
      </div>
    </div>
    
    </div>

    <Chat client={client} darkMode={true}>
      <div className='flex flex-col grow-0'>
  <ChannelList filters={filters} sort={sort} Preview={ChannelPrev} showChannelSearch EmptyStateIndicator={CustomEmptyStateIndicator}/>
  </div>
  {/*Placeholder screen here*/}

  <div className='w-full mx-auto'>
  <Channel>
    <Window>
      <ChannelHeader />
      <MessageList />
      <MessageInput />
    </Window>
    <Thread />
  </Channel>
  </div>
</Chat>
</div>
{createModal && 
    <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
<div class="relative p-4 w-full max-w-md h-full md:h-auto">
        <div class="relative rounded-lg shadow bg-gray-800">
            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
            </button>
            <div class="py-6 px-6 lg:px-8">
                <h3 class="mb-2 text-xl font-medium text-white">Create A Group</h3>
                <h1 class="mb-2 text-red-500 font-bold"></h1>
                <form class="space-y-6 ">
                  <div>
                    <div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-300">Group Name</label>
                        <input type="text" id="deck-name" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" onChange={event => setGroupName(event.target.value)}/>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-300 pt-2">Group Image/Icon</label>
                        <input type="text" id="deck-description" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 text-white" onChange={event => setGroupIcon(event.target.value)}/>
                    </div>
                    <label for="checked-toggle" class="inline-flex relative items-center cursor-pointer mt-3">
                        <input type="checkbox" value="" id="checked-toggle" class="sr-only peer"/>
                        <div  class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" onClick={event => handleDMToggle(event)}></div>
                        <span class="ml-3 text-sm font-medium text-gray-900 text-gray-300"><span class="bg-yellow-200 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded mb-1 uppercase ">{dm ? "DM" : "CIRCLE"}</span>
</span>
                      </label>
                    </div>
                    </div>
                    <div class="flex flex-row">
                    <h1 class="text-2xl font-bold text-white">Members</h1>
                    <div class="pl-2 pt-1 cursor-pointer" onClick={event => addMember(event)}>
                    <PlusIcon class="text-white h-7 w-7 px-1 bg-blue-600 rounded-full cursor-pointer transition ease-in-out hover:scale-110"/>
                    </div>
                    </div>
                    <div class="flex flex-col" >
                    {members.map((m,i) => {
                      return (
                        <div class="flex justify-between gap-3" key={m.id}>
                        <div className='w-full'>
                            <label class="block mb-2 text-sm font-medium text-gray-300">Member Email</label>
                            <input type="text" id="deck-description" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 text-white mb-2" placeholder="Email" onChange={event => updateMember(event, m, i)}/>
                        </div>
                        <div class="pl-2 cursor-pointer flex flex-row pt-8" onClick={event => removeMember(event, i, m.id)}>
                        <MinusIcon class="text-white h-7 w-7 px-1 bg-gray-600 rounded-full cursor-pointer transition ease-in-out hover:scale-110"/>
                        </div>
                        </div>)})}
                    </div>
                    <button class="w-full text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center" onClick={event => createGroup(event)}>Create Group</button>
                </form>
            </div>
        </div>
    </div>


    </div>
  }
</>
  )
}

export default circles
