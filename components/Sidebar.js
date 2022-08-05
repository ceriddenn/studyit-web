import React, {useEffect} from 'react'
import {useRouter} from 'next/router'
import {LogoutIcon, HomeIcon, CogIcon, SearchCircleIcon, ChatAlt2Icon} from '@heroicons/react/outline'
import supabase from '../lib/supabase'
import Circles from './Circles'
import StudySidebar from './StudySidebar'
const Sidebar = (props) => {
    const {query} = useRouter()
    const router = useRouter()
    const session = supabase.auth.session()

    const handleAccountRedirect = () => {
      router.push('/dashboard/profile?id=' + session.user.id)
    }
  return (
    <div class="flex">
    <div class="flex flex-col w-64 h-screen px-4 py-8 overflow-y-auto bg-gray-800 sticky top-0 left-0">
        <img class="mr-6 cursor-pointer" src="https://i.ibb.co/VMvNFzP/logo-transparent-background.png" alt="Logo" onClick={() => router.push('/')}/>
      <div class="flex flex-col justify-between mt-6">
        <aside>
          <ul class="space-y-3">
            <li>
              <a href="/dashboard/home" class={router.pathname == '/dashboard/home' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"}>
                <HomeIcon class="w-6 h-6"/>
                <span class="mx-4 font-medium">MyDecks</span>
              </a>
            </li>

            <li>
              <a href="/dashboard/explore" class={router.pathname == '/dashboard/explore' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"}>
              <SearchCircleIcon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Explore</span>
              </a>
            </li>

            <li>
              <a href="/dashboard/circles" class={router.pathname == '/dashboard/circles' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"}>
              <ChatAlt2Icon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Circles</span>
              </a>
            </li>
            <li>
              <a href="/dashboard/study" class={router.pathname.includes('/dashboard/study/') ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4"}>
              <ChatAlt2Icon class="w-6 h-6"/>
                <span class="mx-4 font-medium">Study</span>
              </a>
            </li>
            {router.pathname.includes('/dashboard/study/') && <StudySidebar id={props.id}/>}


            <li className="absolute bottom-0 left-0 cursor-pointer">
              <a onClick={() => handleAccountRedirect()} class={router.pathname == '/dashboard/profile' ? "flex items-center px-4 py-2 text-gray-600 rounded-md  bg-gray-200 mb-4 ml-4" : "flex items-center px-4 py-2 text-gray-400 rounded-md mb-4 ml-4"}>
              <CogIcon class="w-6 h-6"/>
                <span class="mx-4 font-medium">My Account</span>
              </a>
            </li>

          </ul>

        </aside>
        
      </div>
    </div>
    
    </div>
  )
}

export default Sidebar