import '../styles/globals.css'
import supabase from '../lib/supabase'
import {useState, useEffect} from 'react'
import SiteStatus from '../components/SiteStatus'

const up = true
function MyApp({ Component, pageProps }) {
  const [showComponent, setShowComponent] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    supabase.from('Sitedata').select('siteStatus').match({id: 1}).then(res => {
      if (res.data[0].siteStatus == "online") {
        setShowComponent(false)
      } else {
        setShowComponent(true)
      }
    })
    setIsLoading(false) 
  }, [])
  if (isLoading) {
    return <h1>Loading...</h1>
  } else {
  if (showComponent) {
    return <SiteStatus/>
  } else {
  return <Component {...pageProps} />}
  }
}

export default MyApp
