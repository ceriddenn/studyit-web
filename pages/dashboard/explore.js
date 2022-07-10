import React from 'react'
import Sidebar from '../../components/Sidebar'
import supabase from '../../lib/supabase'
import 'react-toastify/dist/ReactToastify.css'
import {toast, ToastContainer} from 'react-toastify'
import { useRouter } from 'next/router'
const explore = () => {
    const router = useRouter()
    const session = supabase.auth.session()
    const findSomeone = async (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        await supabase.from('Profile').select('*').match({username:username}).then(res => {
            if (!res.data[0]) {
                toast.error('There was no user found with that username!')
            } else {
                router.push('/dashboard/profile?id=' + res.data[0].id)
            }
        })
    }
  return (
    <div className="flex">
        {/* sidebar */}
        <Sidebar/>
        <div className="bg-gray-300 min-h-screen w-full h-full overflow-y-auto relative">
            {/* explore content */}
            <h1>{session && session.user && session.user.id}</h1>

            <div className="absolute top-0 right-0">
            <form onSubmit={event => findSomeone(event)}>
            <input type="text" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-4 mr-4" placeholder="Find Someone"/>
            <button class="bg-yellow-400 text-white border border-solid border-6 border-yellow-400 rounded-lg py-2 px-2 mr-4">Go!</button>
            </form>
            </div>
        </div>
        <ToastContainer theme="colored" position="bottom-right"/>

    </div>
  )
}

export default explore