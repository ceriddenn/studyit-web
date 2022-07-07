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
    const router = useRouter()

    useEffect(() => {
      setLoading(true)
      async function query1() {
        if (query.id === undefined) {setReload(reload + 1); return;}
      await supabase.from('Profile').select('*').match({id:query.id}).then(res => {
          const user = res.data[0]
         // handle is userid does not exist here


         
          setUserData(user)
          setLoading(false)
      })
    }
    query1()
    }, [reload])
  return (
    <div>
        <Header/>
        <h1>{userData.id}</h1>
        <button onClick={() => setReload(reload + 1)}>Run useffect</button>
    </div>
  )
}

export default profile