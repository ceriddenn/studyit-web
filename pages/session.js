import React from 'react'
import {io} from 'socket.io-client'
const session = () => {
    const createSessionAndConnect = async (event) => {
        const socket = io("https://SessionServer.ceriddennteam.repl.co")
        event.preventDefault()
        const newPin = Math.floor(100000 + Math.random() * 900000)
        const gameData = {
            pin: newPin,
            deckId: 111111111,
        }
        socket.emit("game-init", gameData)
        socket.on("game-initt", (data) => {
            console.log(data)
        })
    }
    const connectToGame = async (event) => {
        event.preventDefault()
        const socket = io("https://SessionServer.ceriddennteam.repl.co")

        const pin = document.getElementById("input1").value
        console.log(pin)
        socket.emit("connect-to-game", {pin: pin})
        socket.on("connect-response", (data) => {
            console.log(data)
        })
    }
  return (
    <div>

        <button className='py-2 px-4 bg-yellow-400 rounded-md' onClick={event => createSessionAndConnect(event)}>Start a game session</button>
        <input type="text" id="input1" placeholder="Game Id"/>
        <button className='py-2 px-4 bg-yellow-400 rounded-md mr-4' onClick={event => connectToGame(event)}>Start a game session</button>

    </div>
  )
}

export default session