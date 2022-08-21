import React , {useState, useEffect}from 'react'
import { requestNewUserToken } from '../../lib/streamchat'
import supabase from '../../lib/supabase'
import {StreamChat} from 'stream-chat'
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from 'stream-chat-react'

import  'stream-chat-react/dist/css/index.css'

const apiKey = "283u2ftt83su"

const circles = () => {
  const [client, setClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [userData, setUserData] = useState([{}])
  useEffect(() => {
    async function init() {
      let chatUserToken;
      let authUser;
      const chatClient = StreamChat.getInstance(apiKey)
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
        image: "google.com",
      }
      await chatClient.connectUser(user, chatUserToken)
      const channel = chatClient.channel('messaging', "test_channel", {
        image: "google.com",
        name: "Test Channel",
        members: ["b87e1d31-d9db-40a6-b280-03fd6ec4d4f6", "7a26142e-a493-4ffd-9d17-0e9b3635da18", "cde03748-c6c8-4207-b52e-c3b3a91cefba"],
      })
      await channel.watch()
      
      setClient(chatClient)
      setChannel(channel)
    }
    init()
    if (client) return () => client.disconnectUser()
  },[])
  if (!client) return <LoadingIndicator />
  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  )
}

export default circles