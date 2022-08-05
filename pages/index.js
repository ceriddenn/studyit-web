import Head from 'next/head'
import Image from 'next/image'
import {useRouter} from 'next/router'
import supabase from '../lib/supabase'
import { useEffect } from 'react'
import Header from '../components/Header'
import { BsHandThumbsDownFill } from 'react-icons/bs'
import Landing from '../components/Landing'
const Home = () => {
  const router = useRouter()
  const session = supabase.auth.session()
 
  return (
    <div className=''>
      <Head>
        <title>StudyIt | Landing</title>
        <link rel="icon" href="https://i.ibb.co/R44bRPW/justlogo.jpg"/>
      </Head>
      <Header/>
      <Landing/>

    </div>
  )
}

export default Home
