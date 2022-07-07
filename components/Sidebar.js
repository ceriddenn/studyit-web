import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import MyDeck from './MyDeck'
import {LogoutIcon, HomeIcon, CogIcon, SearchCircleIcon, ChatAlt2Icon} from '@heroicons/react/outline'
import Explore from './Explore'
import supabase from '../lib/supabase'
import Circles from './Circles'
import ProfileContent from './ProfileContent'
const Sidebar = () => {
    const {query} = useRouter()
    const router = useRouter()
    const session = supabase.auth.session()

    const handleAccountRedirect = () => {
      router.push('/profile?id=' + session.user.id + '&page=profile')
    }
    
  return (
    <div class="flex">
    <div class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto border-r bg-gray-800 sticky top-0 left-0">
        <a class="text-blue-700 text-2xl font-bold cursor-pointer pl-4" href="/">StudyIt</a>
      <div class="flex flex-col justify-between mt-6">
        <aside>
          <ul class="space-y-3">
            <li>
              <a class={query.page == 'home' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200" : "flex items-center px-4 py-2 text-gray-400 rounded-md"} href="/studyit?page=home">
                <HomeIcon class="w-6 h-6"/>
                <span class="mx-4 font-medium">MyDecks</span>
              </a>
            </li>

            <li>
              <a class={query.page == 'explore' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200" : "flex items-center px-4 py-2 text-gray-400 rounded-md"} href="/studyit?page=explore">
              <SearchCircleIcon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Explore</span>
              </a>
            </li>

            <li>
              <a class={query.page == 'circles' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200" : "flex items-center px-4 py-2 text-gray-400 rounded-md"} href="/studyit?page=circles">
              <ChatAlt2Icon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Circles</span>
              </a>
            </li>

            <li className="absolute bottom-0 left-0 cursor-pointer">
              <a class={query.page == 'profile' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4 ml-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4 ml-4"}>
              <CogIcon class="w-6 h-6"/>
                <span class="mx-4 font-medium" onClick={() => handleAccountRedirect()}>My Account</span>
              </a>
            </li>

          </ul>

        </aside>
        
      </div>
    </div>
    <div class="w-full h-full overflow-y-auto relative">

        {query.page == 'home' && <MyDeck/>}
        {query.page == 'circles' && <Circles/>}
        {query.page == 'explore' && <Explore/>}
        {query.page == 'profile' && <ProfileContent/>}
        {query.page !== 'home' && query.page !== 'profile' && query.page !== 'circles' && query.page !== 'explore' && "This page does not exist"  }
    </div>
    </div>
  )
}

export default Sidebar