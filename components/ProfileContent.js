import { useRouter } from 'next/router'
import React, {useEffect} from 'react'

const ProfileContent = () => {
    const {query} = useRouter()
    const page = query.id
    useEffect(() =>{
        console.log(page)
    },[])
  return (
    <div>ProfileContent</div>
  )
}

export default ProfileContent