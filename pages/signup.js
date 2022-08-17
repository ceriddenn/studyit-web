import {useRouter} from 'next/router'
import { totalmem } from 'os';
import {useState} from 'react'
import {BsArrowLeft} from 'react-icons/bs'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import supabase from '../lib/supabase'
import {useEffect} from 'react'
import Head from 'next/head'
const signup = () => {

    const router = useRouter()
    const [show, setShow] = useState(false)

    //BETA VARS

    
    const [isBeta, setIsBeta] = useState(false)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const delay = ms => new Promise(res => setTimeout(res, ms));
    const serverURL = "https://StudyIt-Backend.ceriddenn.repl.co/sendsignupemail"

    async function handleGoBack(event) {
      event.preventDefault()
      router.push('/login')
    }
    async function handleSignup(event) {
        event.preventDefault();
        if (localStorage.getItem('betatoken').length > 0) {
          const token = localStorage.getItem('betatoken')
          await supabase.from('BetaUsers').delete().match({betaToken:token}).then(async res => {
            console.log(res)
          })
        }
        const email = event.target.email.value
        const password = event.target.password.value
        const username = event.target.username.value
        const confirm_password = event.target.confirmpassword.value
        const firstname = event.target.firstname.value
        const lastname = event.target.lastname.value

        if (!firstname) {
          toast.error("Please enter your first name")
          return;
        }
        if (!lastname) {
          toast.error("Please enter your last name")
          return;
        }
        if (email) {
        if (password == confirm_password) {
            await supabase.auth.signUp({email: email, password: password}).then(async res => {
                if (!res.error) {
                if (res) {
                  const confirmEmailLink = await supabase.auth.api.generateLink(
                    'signup',
                    res.user.email
                  )
                  fetch("https://StudyIt-Backend.ceriddenn.repl.co/sendsignupemail", {
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              recip: res.user.email,
              veri: confirmEmailLink.data.action_link
            }),
            method: 'POST',

            
          })
                  console.log(confirmEmailLink)
                  const newProfile = {
                    id: res.user.id,
                    email: res.user.email,
                    username: username.toLowerCase(),
                    firstname: firstname,
                    lastname: lastname,
                    avatarURL: 'https://cdn.iconscout.com/icon/free/png-256/account-avatar-profile-human-man-user-30448.png',
                    badges: [{}],
                  }
                  await supabase.from('Profile').upsert(newProfile).then(res => {
                    if (res) {
                      setShow(true)
                      toast.success('Verify your email. A link was sent to your inbox.')

                    } else {
                      toast.error('Something unexpected happened..')
                    }
                  })
                } else {
                    toast.error('Something unexpected happened..')
                }
            } else {
                toast.error(res.error.message)
            }
            })
        } else {
            toast.warning(`'Passwords don't match please try again.'`)
        }
    } else {
        toast.warning('Please input a email.')
    }
    }

    async function handleRedirect(event) {
        event.preventDefault()
        router.push('/login')
    }
    useEffect(() => {
      setIsBeta(false)
      const session = supabase.auth.session()
      if (session) {
        router.push("/")
      } else {
        return;
      }

    }, [])

    const checkIfBeta = async (event) => {
      //query supabase
      event.preventDefault()
      const clientname = event.target.clientname.value
      const access_token = event.target.beta_token.value
      localStorage.setItem('betatoken', access_token)
      await supabase.from('BetaUsers').select('*').match( {clientname: clientname,betaToken: access_token} ).then(async res => {
        if (res.data.length == 0) {
          setSuccess(false)
          setError(true)
          return;
        } else {
          setError(false)
          setSuccess(true)
          await delay(4000)
          setIsBeta(true)
          return;
        }
      })
    }

    return (
      <>
      
        <Head>
        <title>StudyIt | SignUp</title>
        <link rel="icon" href="https://i.ibb.co/sb2psmq/justlogo-removebg-preview-3.png"/>
      </Head>
      {!isBeta? <div>
        <div class="h-screen flex flex-col justify-center items-center">
          <span className='text-black font-bold text-lg'>Enter your clientname and beta token</span>
          <h1 className='text-black font-semibold text-md break-all'>The clientname is the name you applied for beta access with (must be 100% correct to gain access to signup). 
          <br/> The beta token is the beta key you recieved in an email or by a StudyIt team member in our discord server.</h1>
          <div>
            <form className='space-y-6 mt-6' onSubmit={event => checkIfBeta(event)}>
            <input type="text" id="clientname" class="bg-gray-300 shadow-md border border-blue-500 text-black placeholder-black text-sm rounded-lg block w-full p-2.5" placeholder="Client Name"/>
            <input type="password" id="beta_token" class="bg-gray-300 shadow-md border border-blue-500 text-black placeholder-black text-sm rounded-lg block w-full p-2.5" placeholder="Beta Token"/>
            {success &&
            <p class="mt-2 text-sm text-green-600 text-green-500"><h1 class="font-medium">Success!</h1> The provided info was found to be correct, <br/> redirecting you to signup...</p>}
            {error &&
            <p class="mt-2 text-sm text-red-600 text-red-500"><span class="font-medium">An error occured!</span> The provided info was found to be incorrect, <br/> if this keep occuring please contact support@studyit.ml</p>}
            
            <div className='justify-center flex'>
            <button className='text-white bg-yellow-400 px-4 py-2 rounded-md'>Submit</button>
            </div>
            </form>
          </div>

        </div>
      </div> : 
    <div class="min-h-screen flex flex-col items-center justify-center bg-gray-300">
    <div class="flex flex-col bg-white shadow-md px-4 sm:px-6 md:px-8 lg:px-10 py-8 rounded-md w-full max-w-md">
      {show ? <BsArrowLeft class="text-2xl cursor-pointer rounded-lg hover:text-gray-600" onClick={handleGoBack}/> : ""}
      <div class="font-medium self-center text-xl sm:text-2xl uppercase text-gray-800">Signup to StudyIT</div>
      
      <div class="relative mt-10 h-px bg-gray-300">
        <div class="absolute left-0 top-0 flex justify-center w-full -mt-2">
          <span class="bg-white px-4 text-xs text-gray-500 uppercase">Signup with email</span>
        </div>
      </div>
      <div class="mt-10">
        <form action="#" onSubmit={handleSignup}>
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
          <div class="flex flex-col mb-6">
            <label for="username" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Username</label>
            <div class="relative">
              <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
  
              <input id="username" type="text" name="username" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Username" />
            </div>
          </div>
          <div className='flex flex-row gap-2'>
          <div class="flex flex-col mb-6">
            <label for="firstname" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">First Name</label>
            <div class="relative">
              <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
  
              <input id="firstname" type="text" name="firstname" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="First Name" />
            </div>
          </div>
          <div class="flex flex-col mb-6">
            <label for="lastname" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Last Name</label>
            <div class="relative">
              <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
  
              <input id="lastname" type="text" name="lastname" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Last Name" />
            </div>
          </div>
          </div>
          <div class="flex flex-col mb-6">
            <label for="password" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Password:</label>
            <div class="relative">
              <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <span>
                  <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
  
              <input id="password" type="password" name="password" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Password" />
            </div>
            
          </div>
          <div class="flex flex-col mb-6">
            <label for="confirmpassword" class="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">Confirm Password</label>
            <div class="relative">
              <div class="inline-flex items-center justify-center absolute left-0 top-0 h-full w-10 text-gray-400">
                <span>
                  <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
  
              <input id="confirmpassword" type="password" name="ConfirmPassword" class="text-sm sm:text-base placeholder-gray-500 pl-10 pr-4 rounded-lg border border-gray-400 w-full py-2 focus:outline-none focus:border-blue-400" placeholder="Retype password" />
            </div>
            
          </div>
          <div class="flex w-full">
            <button type="submit" class="flex items-center justify-center focus:outline-none text-white text-sm sm:text-base bg-blue-600 hover:bg-blue-700 rounded py-2 w-full transition duration-150 ease-in">
              <span class="mr-2 uppercase">Signup</span>
              <span>
                <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
      <div class="flex justify-center items-center mt-6">
        <a href="#" target="_blank" class="inline-flex items-center font-bold text-blue-500 hover:text-blue-700 text-xs text-center">
          <span>
            <svg class="h-6 w-6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </span>
          <span class="ml-2" onClick={handleRedirect}>Already have an account?</span>
        </a>
      </div>
    </div>
    <ToastContainer theme="colored" position="bottom-right"/>
  </div>}

  </>
  )
}

export default signup
