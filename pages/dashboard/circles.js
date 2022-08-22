import React , {useState, useEffect}from 'react'
import { requestNewUserToken } from '../../lib/streamchat'
import {LogoutIcon, HomeIcon, CogIcon, SearchCircleIcon, ChatAlt2Icon} from '@heroicons/react/outline'
import {getChannel} from '../../lib/streamchat'
import supabase from '../../lib/supabase'
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
const CustomEmptyStateIndicator = () => {
  return (
    <h1 className='flex justify-center'>No circles or dms found.</h1>
  )
}
const apiKey = "283u2ftt83su"
const name = "Finnean"
const circles = () => {
  const [client, setClient] = useState(null)
  const [userData, setUserData] = useState([{}])
  const [channel, setChannel] = useState(null)
  const [update1, setUpdate1] = useState(true)
  const session = supabase.auth.session()
  const delay = ms => new Promise(res => setTimeout(res, ms));

  useEffect(() => {
    async function init() {
      let chatUserToken;
      let authUser;
      const chatClient = StreamChat.getInstance("283u2ftt83su")
      const session = supabase.auth.session()
      const userId = session.user.id
      await supabase.from('Profile').select('*').match({id:userId}).then(async res => {
        authUser = res.data[0]
      })
      await requestNewUserToken(userId, authUser.id).then(async res => {
        chatUserToken = res.token
      })
      const user = {
        id: authUser.id,
        name: authUser.username,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxim50eCwGskkSZLoh7lJJkTA3zruwUSD5MNh4R3Wg4pIXxdlcob6gJY2-Pb2LsomK4p8:https://i.guim.co.uk/img/media/fe1e34da640c5c56ed16f76ce6f994fa9343d09d/0_174_3408_2046/master/3408.jpg%3Fwidth%3D1200%26height%3D900%26quality%3D85%26auto%3Dformat%26fit%3Dcrop%26s%3D0d3f33fb6aa6e0154b7713a00454c83d&usqp=CAU",
      }
      await delay(1000)
      await chatClient.connectUser(user, chatUserToken)
      setClient(chatClient)
    }
    init()
    if (client) return () => client.disconnectUser()
  },[])
  //if (!client) return (
  //<div className='flex justify-center items-center h-screen flex-col pb-2'>
  //<LoadingIndicator size="100"/>
  //<h1 className='text-blue-600 font-semibold text-2xl'>Connecting your studyit account to our chat network!</h1>
  //</div>)
  const filters = { type: 'messaging', members: { $in: [session.user.id] }}
    const sort = { last_message_at: -1 }
  const createCircle = async (event) => {
    event.preventDefault()
    const session = supabase.auth.session()
    const userId = session.user.id
    let otherUserId;
    const input1 = document.getElementById('input1').value;
    const email = document.getElementById('input2').value;
    await supabase.from('Profile').select('*').match({email:email}).then(async res => {
      otherUserId = res.data[0].id
    })
    const channel = client.channel('messaging',input1, {
      image: "google.com",
      name: input1,
      members: [userId, otherUserId],
      owner: userId,
      mode: 'circle'
    })
    await channel.watch()
  }


  return (
    <>
        <div className='flex flex-row'>

        <div class="flex">
    <div class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gray-800 sticky top-0 left-0">
        <img class="mr-6 cursor-pointer" src="https://i.ibb.co/VMvNFzP/logo-transparent-background.png" alt="Logo"/>
      <div class="flex flex-col justify-between mt-6">
        <aside>
          <ul class="space-y-3">
            <li>
              <a href="/dashboard/study" class="flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4">
              <ChatAlt2Icon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Cirlces</span>
              </a>
            </li>
            <li>
              <button onClick={event => createCircle(event)}>Create new Circle</button>
              <input id="input1" placeholder='Circle name'/>
              <input id="input2" placeholder='User you want to add via email'/>

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
</>
  )
}

export default circles
