import { ChannelPreviewUIComponentProps, useChatContext } from 'stream-chat-react';
import { MinusCircleIcon } from '@heroicons/react/outline'
import {Avatar} from 'stream-chat-react';
import supabase from '../../lib/supabase';
import {StreamChat} from 'stream-chat'
import { useRouter } from 'next/router';
import { useState } from 'react';
export const ChannelPrev = (props) => {
  const client = StreamChat.getInstance("283u2ftt83su")
  let selected;
  const router = useRouter()
  const { channel, setActiveChannel } = props;
  const { channel: activeChannel } = useChatContext();
  if (activeChannel === undefined) {
    selected = false;
  } else {
    selected = channel.id === activeChannel.id
  }
  const renderMessageText = () => {
    if (channel.state.messages.length) {
    const lastMessageText = channel.state.messages[channel.state.messages.length - 1].text;

    const text = lastMessageText || 'message text';

    return text.length < 60 ? lastMessageText : `${text.slice(0, 70)}...`;
    } else {
      return 'No messages yet';
    }
  };

  const handleDeleteOrLeave = async (channel) => {
    const session = supabase.auth.session();
    const filters = { type: 'messaging', members: { $in: [session.user.id] }}
    const sort = { last_message_at: -1 }
    if (channel.owner === session.user.id) {
    const query = await fetch("https://InnocentFlakyConversions.ceriddennteam.repl.co/hdc", {
      headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: channel.data.id,
              userId: session.user.id,
              type: channel.data.type
            }),
            method: 'POST',
    })
  } else {
    await channel.removeMembers([session.user.id])
  }
  const channelQuery = await client.queryChannels(filters, sort, {
    watch: false,
    state: true
  })
  setActiveChannel(channelQuery[0])
  }
  return (
    <div className='fex '>
      {channel.data.mode === 'circle' && 
    <div
      className={selected ? 'channel-preview__container selected' : 'channel-preview__container'}
      onClick={() => setActiveChannel(channel)}
    >
      <div className='channel-preview__content-wrapper'>
        <div className='channel-preview__content-top flex-row'>
          <p className='channel-preview__content-name pt-4'>{channel.data.name + " " || 'Channel'}</p>
          
        </div>
        <div className='flex flex-row'>
        <p className='channel-preview__content-message'>{renderMessageText()}</p>
        </div>
        
      </div>
      <div className='flex flex-row justify-end items-end flex-grow'>
        <span class="bg-yellow-200 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded mb-1 uppercase ">{channel.data.mode}</span>
        <MinusCircleIcon className="h-8 w-8 text-blue-600 mr-2 cursor-pointer pl-2 transition ease-in-out hover:scale-110" onClick={() => handleDeleteOrLeave(channel)}/>
        </div>
    </div>}
    </div>
  );
};

