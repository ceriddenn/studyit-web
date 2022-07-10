import '../styles/globals.css'
import {useState, useEffect} from 'react'
import MobileLanding from '../components/MobileLanding'
import mobile from 'is-mobile'
function MyApp({ Component, pageProps }) {
  if (mobile()) {
    return <MobileLanding/>
  } else {
  return <Component {...pageProps} />
  }
}

export default MyApp
