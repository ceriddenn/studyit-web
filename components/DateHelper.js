import React, {useState, useEffect} from 'react'

const DataHelper = ({date}) => {
    const time = new Date(date).toISOString().toLocaleString('zh-TW').slice(0, -14)
  return (
    <div>
      <h1 className="text-white">Created on {time}</h1>
    </div>
  )
}

export default DataHelper

