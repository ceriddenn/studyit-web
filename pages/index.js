import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'
import supabase from '../lib/supabase'
import { useEffect } from 'react'
import Header from '../components/Header'
import { BsHandThumbsDownFill } from 'react-icons/bs'

const Home = () => {
  const router = useRouter()
  const session = supabase.auth.session()
  return (
    <div>
      <Header/>

      {!session ?
      <div className="absolute bottom-0 right-0 pb-10 pr-10 rounded-md">
        <a href="/signup" class="relative px-5 py-3 overflow-hidden font-medium text-white bg-yellow-400 border border-gray-100 rounded-lg shadow-inner group">
        <span class="relative">Create an account?</span>
      </a>
      </div> : ""}
    </div>
  )
}

export default Home
