import { useRouter } from 'next/router'
import React, {useState} from 'react'
import {BsArrowLeft} from 'react-icons/bs'
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify'
import supabase from '../lib/supabase'
import Head from 'next/head'
const passwordreset = () => {
  const router = useRouter()
  const serverURL = "https://InnocentFlakyConversions.ceriddennteam.repl.co/sendresetemail"
  const handleReset = async (event) => {
    event.preventDefault()
    const query = await fetch(serverURL, {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              email: event.target.email.value,
            }),
            method: 'POST',

            
          })
          const result = await query.json()
          if (result.error == null) {
            toast.success(result.message)
          } else {
            toast.error(result.error)
          }
  }

  return (
    <>
      <Head>
        <title>StudyIt | Reset</title>
        <link rel="icon" href="https://i.ibb.co/sb2psmq/justlogo-removebg-preview-3.png"/>
      </Head>
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-300">
  <div class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
  <BsArrowLeft class="text-2xl cursor-pointer rounded-lg hover:text-gray-600" onClick={() => router.push('/login')}/>
    <div class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Reset Password</div>
    <div class="mt-10">
      <form action="#" onSubmit={handleReset}>
        <div class="flex flex-col mb-6">
          <label for="email" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">E-Mail Address:</label>
          <div class="relative">
            <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>

            <input id="email" type="email" name="email" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="E-Mail Address" />
          </div>
        </div>
        <div class="flex w-full">
          <button type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
            <span class="mr-2 uppercase">Reset</span>
            <span>
              <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <ToastContainer theme="colored" position="bottom-right"/>

  </div>
  </>
  )
}

export default passwordreset
