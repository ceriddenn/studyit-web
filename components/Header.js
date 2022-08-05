import supabase from '../lib/supabase'
import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {IdentificationIcon} from '@heroicons/react/outline'
const Header = () => {
    const session = supabase.auth.session()
    const [avatar, setAvatar] = useState("")
    const [dropdown, setDropDown] = useState(false)
    const [landingAlert, setLandingAlert] = useState("")
    const [showLandingAlert, setShowLandingAlert] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() =>
    {
      supabase.from('Sitedata').select('*').match({id: 1}).then(res => {
        setShowLandingAlert(res.data[0].showLandingAlert)
        setLandingAlert(res.data[0].landingAlert)
      })

        try 
        {
            supabase.from('Profile').select('*').eq('id', session.user.id).then(async res => {
                if (res.body.length > 0) {
                setIsAdmin(res.data[0].isAdmin)
                setAvatar(res.body[0].avatarURL)
                } else {
                    return
                }
            })
        } catch (e) {return}


    }, [])

    async function handleMMOpen(event) {
        event.preventDefault()
        setDropDown(true)
    }
    async function handleMMClose(event) {
        event.preventDefault()
        setDropDown(false)
    }
    const handleUserButton = (event) => {
      if (session) {
        supabase.auth.signOut();
        window.location.reload()
      } else {
        router.push("/login")
      }
    }

    return (
        <nav class="bg-white border-gray-200 px-2 lg:py-4 sm:px-4 py-2.5 dark:bg-gray-800">
  <div class="container flex flex-wrap justify-between items-center mx-auto">
  <a href="https://studyit.ml" class="flex items-center">
      <img src="https://i.ibb.co/VMvNFzP/logo-transparent-background.png" class="mr-3 h-16 sm:h-16" alt="StudyIt Logo" />
      {showLandingAlert &&
<div class="hidden lg:flex p-4 text-sm text-gray-700 bg-gray-100 rounded-lg dark:bg-gray-700 dark:text-gray-300" role="alert">
  <span class="font-medium">Alert!&nbsp;</span> {landingAlert}
</div>}
  </a>
  
  <div class="flex items-center md:order-2">
    <a onClick={handleUserButton} class="hidden lg:inline-flex items-center mr-20 justify-center h-12 px-6 font-medium tracking-wide text-white transition duration-200 bg-blue-600 rounded-lg hover:bg-blue-800 hover:text-white focus:shadow-outline focus:outline-none cursor-pointer">
    {session ? "Signout" : "Login"}
    {isAdmin && <IdentificationIcon class="h-5 w-5 ml-1"/>}

    </a>

      <button type="button" class="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 " id="user-menu-button" aria-expanded="false" data-dropdown-toggle="dropdown">
        <span class="sr-only">Open user menu</span>
        {avatar && <img class="w-8 h-8 rounded-full ring-2 ring-offset-1 ring-offset-gray-800 ring-blue-600" src={avatar} alt="user photo"/>}
      </button>
      
      <button data-collapse-toggle="mobile-menu-2" type="button" class="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
      <span class="sr-only">Open main menu</span>
      {!dropdown && <svg onClick={handleMMOpen} class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>}
      {dropdown && <svg onClick={handleMMClose}class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>}
    </button>
  </div>
  
  <div className={(dropdown) ? ("justify-between items-center w-full md:flex md:w-auto md:order-1") : ("hidden justify-between items-center w-full md:flex md:w-auto md:order-1")} id="mobile-menu-2">
    <ul class="flex flex-col mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
      <li>
        <a href="/" class={router.pathname == '/' ? "text-1xl font-extrabold block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" : "text-1xl font-extrabold block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}aria-current="page">Home</a>
      </li>
      <li>
        <a href="/aboutus" class={router.pathname == '/aboutus' ? "text-1xl font-extrabold block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" : "text-1xl font-extrabold block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}aria-current="page">About</a>
      </li>
      <li>
        <a href="/dashboard/home" class={router.pathname == '/dashboard/' ? "text-1xl font-extrabold block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white" : "text-1xl font-extrabold block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"}>StudyIt</a>
      </li>
      <li>
        <a href="#" class="text-1xl font-extrabold block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Pricing</a>
      </li>
      <li>
        <a href="#" class="text-1xl font-extrabold block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</a>
      </li>
    </ul>
  </div>
  
  </div>
</nav>
    )
}

export default Header