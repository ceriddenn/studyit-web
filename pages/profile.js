import { useRouter } from 'next/router'
import React, {useState, useEffect} from 'react'
import Header from '../components/Header'
import supabase from '../lib/supabase'
const profile = () => {
    const [userData, setUserData] = useState([])
    const {query} = useRouter()
    const [reload, setReload] = useState(1)

    const [loading, setLoading] = useState(false)

    const delay = ms => new Promise(res => setTimeout(res, ms));

    useEffect(() => {
      setLoading(true)
      async function query1() {
        if (query.id === undefined) {setReload(reload + 1); return;}
      await supabase.from('Profile').select('*').match({id:query.id}).then(res => {
          const user = res.data[0]
          setUserData(user)
          setLoading(false)
      })
    }
    query1()
    }, [reload])
  return (
    <div>
      {loading && {/* add loading logic here */}}
        <Header/>
        <h1>{userData.id}</h1>
    </div>
  )
}

export default profile