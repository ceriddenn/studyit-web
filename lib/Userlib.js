import React, { useEffect, useState } from 'react'
import supabase from './supabase'
const Userlib = ({user}) => {
        const [username, setUsername] = useState("")
        useEffect(() => {
            const query = async () => {
                await supabase.from('Profile').select('*').match({id:user}).then(res => {
                    setUsername(res.data[0].username)
                })
            }
            query()
        },[])
  return (
    <span>{username && username}</span>
  )
}

export default Userlib