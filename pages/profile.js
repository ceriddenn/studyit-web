import React, {useState, useEffect} from 'react'
import supabase from '../lib/supabase'

const profile = () => {
    const session = supabase.auth.session()


  return (
    <div>
        
    </div>
  )
}

export default profile