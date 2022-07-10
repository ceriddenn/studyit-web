import React from 'react'
import { BounceLoader } from 'react-spinners'
const Loading = () => {
  return (
    <div className="bg-gray-800 h-screen">
        <div className="flex justify-center relative top-72 "> 
        <BounceLoader loading={true} size="120" color="#facc15"/>
        </div>
    </div>
  )
}

export default Loading