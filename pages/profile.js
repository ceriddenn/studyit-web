import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import supabase from '../lib/supabase'
import ProfileContent from '../components/ProfileContent'
const profile = () => {
  return (
    <div class="">
        <Sidebar/>
    </div>
  )
}

export default profile