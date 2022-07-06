import React from 'react'
import {useEffect, useState} from 'react'
import supabase from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import { useRouter } from 'next/router'
const studyit = () => {
  const [loading, setLoading] = useState(true)
  const session = supabase.auth.session()
  const router = useRouter()
  
  useEffect(() =>{
    if (session && session.user) {
      return;
    } else {
      router.push('/login')
    }
    setLoading(false)
  }, [])

  return (
    <>
    {!loading ? <div>bonk</div> :
    <div>
    <div className="">
      <Sidebar/>
      </div>
    </div>}
    </>
  )
}

export default studyit