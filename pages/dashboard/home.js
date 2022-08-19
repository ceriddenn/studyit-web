import React, {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import supabase from '../../lib/supabase'
import { MinusCircleIcon } from '@heroicons/react/outline'
import DataHelper from '../../components/DateHelper'
import { ToastContainer, toast } from 'react-toastify';
import {PlusIcon, MinusIcon} from '@heroicons/react/outline'
import {v4 as uuidv4} from 'uuid'
import EditDeck from '../../components/EditDeck'
import Sidebar from '../../components/Sidebar'
import Loading from '../../components/Loading'
import Head from 'next/head'
const home = () => {
  const delay = ms => new Promise(res => setTimeout(res, ms));
  const [decks, setDecks] = useState([])
  const [error, setError] = useState(false)
  const [showMsg, setShowMsg] = useState(false)
  const router = useRouter()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  const session = supabase.auth.session()
  useEffect(() => {
    setModalErrorMessage(null)
    setShowMsg(false)
    setLoading(true)
    if (session && session.user) {
    async function query() {
      const array1 = []
      const session = supabase.auth.session()
      await supabase.from('StudyDeck').select('*').match({deckOwner: session.user.id}).then(res => {
          const ed = res.body
          ed.forEach(deck => {
          array1.push(deck)
      })
  })
      setDecks(array1)
      setLoading(false)
  }
  query()
} else {
  router.push('/login')
  return;
}
  }, [])

  const deleteDeck = async (id) => {
    await supabase.from('StudyDeck').delete().match({deckId:id}).then(async res => {
      if (res.error) {
        setError(true)
        setShowMsg(true)
        await delay(5000)
        setShowMsg(false)
        setError(false)
        return;
      } else {
        window.location.reload()
        setError(false)
        setShowMsg(true)
        await delay(5000)
        setShowMsg(false)
        setError(false)
      }
    })
  }
  // DECK CREATION AND DYNAMIC FORM STUFF

  //states
  const [showPopup, setShowPopup] = useState(false)
  const [editDeck, setEditDeck] = useState(false)
  const [name, setName] = useState(null)
  const [description, setDescription] = useState(null)
  const [inputItems, setInputItems] = useState([{ id: uuidv4(), 'term': null, 'definition': null }])
  const [modalErrorMessage, setModalErrorMessage] = useState(null)
  const [blur, setBlur] = useState(false)
  const [addDisabled, setAddDisabled] = useState(false)
  const [editDeckId, setEditDeckId] = useState(null)
  //end

  //search pag
  const [searchTerm, setSearchTerm] = useState('')
  //end
  const addInputItems = () => {
    setInputItems([...inputItems, {id: uuidv4(), 'term': null, 'definition': null}])
  }


  const handleDeckCreation = async (event) => {
    setModalErrorMessage(null)
    event.preventDefault()
    if (inputItems.length < 1) {
      setModalErrorMessage('')
      setModalErrorMessage('A term and definition are required to create a deck.')
      return;
    }

    if (name == null) {
      setModalErrorMessage('')
      setModalErrorMessage('The name field was not provided.')
      return;
    } else if (description == null) {
      setModalErrorMessage('')
      setModalErrorMessage('The description field was not provided.')
      return;
    } else if (inputItems[0].term == null || inputItems[0].definition == null) {
      setModalErrorMessage('')
      setModalErrorMessage('A term and definition are required to create a deck.')
      return;
      
    } else {
    await supabase.from('StudyDeck').insert({deckName: name, description: description, contents: inputItems, deckOwner: session.user.id, isDeckPublic: checked}).then(async res => {
      if (res.error) {
        setError(true)
        setShowMsg(true)
        setShowPopup(false)
        await delay(5000)
        setShowMsg(false)
        setError(false)
      } else {
        window.location.reload()
      }
    })
  }
  }

  const handleItemChange = (id, event, type) => {
    event.preventDefault()
    const newInputItems = inputItems.map(i => {
      if(id === i.id) {
        i[type] = event.target.value
      }
      return i
    })
    setInputItems(newInputItems)
  }

  const removeInputItem = (id) => {
    const values = [...inputItems];
    values.splice(values.findIndex(value => value.id === id), 1)
    setInputItems(values)
    
    }

  //end
  // editing deck logic


 
  //end
  const handleIsPublic = (event) => {
    event.preventDefault()
    if (checked) {
      setChecked(false)
    } else {
      setChecked(true)
    }
  }

  return (
    <>
        <Head>
        <title>StudyIt | Dashboard</title>
        <link rel="icon" href="https://i.ibb.co/sb2psmq/justlogo-removebg-preview-3.png"/>
      </Head>
    {loading ? <Loading/> : 
    <div className="flex">
      <Sidebar/>
      
    <div className="bg-gray-300 min-h-screen w-full h-full overflow-y-autorelative">
      <div class={showPopup ? "blur-sm" : ""} className={blur ? "blur-sm" : ""}>
      <div className="p-8 pt-8">
        <div className="flex flex-row">
    <h1 class="text-2xl p-5 font-semibold">MyDecks</h1>
    <input type="text" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2 py-1 mr-4" placeholder="Search" onChange={event => {setSearchTerm(event.target.value)}}/>
    </div>

    {showMsg && 
    <h1 class={error ? "pl-5 text-red-600" : "pl-5 text-green-500"}>{error ? "An error occured please try again." : "Success!"}</h1>
    }
    </div>

    <div className="flex flex-row flex-wrap overflow-hidden">
    {decks.length < 1 && <h1 class="pl-14 font-bold text-gray-700">Pretty empty here... Try creating a <span class="underline text-blue-600 cursor-pointer" onClick={() => setShowPopup(true)}>deck!</span></h1>}
    {decks.filter((val) => {
      if (searchTerm === '') {
        return val
      } else {
        return val.deckName.toLowerCase().includes(searchTerm.toLowerCase())
      }
    }).map(d => {
      return (
        <div key={d.deckId}>
          <div class="flex justify-left pl-12 pb-4">

  <div class="block rounded-lg shadow-lg bg-gray-800 max-w-sm">

    <div class="p-6">

      <div class="flex flex-row">
      {d.deckCI ? <img src={d.deckCI} className="flex flex-row w-11 h-11 rounded-full mr-2"/> : ""}

      <h5 class="text-white text-xl font-medium mt-2">{d.deckName}</h5>
      <MinusCircleIcon className="h-6 w-6 text-blue-600 mt-3 ml-2 cursor-pointer hover:text-blue-700 transition ease-in-out delay-150 hover:scale-110" onClick={() => deleteDeck(d.deckId)}/>
      </div>
      <p class="text-gray-500 text-base mb-8 pt-2">
        {d.description}
      </p>

      <div className='flex flex-row'>
      <button type="button" class=" inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-yellow-500 transition duration-150 ease-in-out" onClick={() => {router.push('/dashboard/study/flashcards?id=' + d.deckId)}}>Study</button>
      <button type="button" class=" inline-block px-6 py-2.5 bg-yellow-400 text-white font-medium text-xs leading-tight uppercase rounded hover:bg-yellow-500 transition duration-150 ease-in-out ml-3" onClick={() => {setEditDeck(true); setEditDeckId(d.deckId); setBlur(true); setAddDisabled(true)}}>Edit</button>
      </div>

    </div>
    <div class="py-3 px-6 border-t border-blue-600 text-gray-600">
      <DataHelper date={d.created_at}/>
    </div>
  </div>
</div>
</div>
      )
    })}
    </div>
    </div>
    {showPopup && (
      <div class="flex justify-center overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 bottom-0">
      <div class="relative p-4 w-full max-w-md h-full md:h-auto">
          <div class="relative rounded-lg shadow bg-gray-800">
              <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => setShowPopup(false)}>
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
              </button>
              <div class="py-6 px-6 lg:px-8">
                  <h3 class="mb-2 text-xl font-medium text-white">Create a Study Deck</h3>
                  <h1 class="mb-2 text-red-500 font-bold">{modalErrorMessage}</h1>
                  <form class="space-y-6 " onSubmit={event => handleDeckCreation(event)}>
                      <div>
                          <label class="block mb-2 text-sm font-medium text-gray-300">Deck Name</label>
                          <input type="text" id="deck-name" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white" placeholder="Name for this deck" onChange={event => setName(event.target.value)}/>
                      </div>
                      <div>
                          <label class="block mb-2 text-sm font-medium text-gray-300">Deck Description</label>
                          <input type="text" id="deck-description" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 text-white" placeholder="A brief description of this deck" onChange={event => setDescription(event.target.value)}/>
                      </div>
                      <label for="checked-toggle" class="inline-flex relative items-center cursor-pointer">
                        <input type="checkbox" value="" id="checked-toggle" class="sr-only peer" checked={checked}/>
                        <div onClick={event => handleIsPublic(event)} class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Make this deck public?</span>
                      </label>
                      <div>
                          <label for="password" class="block mb-2 text-sm font-medium text-gray-300">Deck Owner</label>
                          <input type="text" placeholder={session.user.id.slice(0, -12) + "************"} class="bg-gray-900 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-500 border-gray-500 placeholder-gray-400 text-white" disabled/>
                      </div>
                      <div class="flex flex-row">
                      <h1 class="text-2xl font-bold text-white">Content</h1>
                      <div class="pl-2 pt-1 cursor-pointer" onClick={() => addInputItems()}>
                      <PlusIcon class="text-white h-7 w-7 px-1 bg-blue-600 rounded-full cursor-pointer transition ease-in-out hover:scale-110"/>
                      </div>
                      </div>
                      {inputItems.map(ii => (
                      <div class="flex justify-between gap-3" key={ii.id}>
                      <div>
                          <label class="block mb-2 text-sm font-medium text-gray-300">Term</label>
                          <input type="text" id="deck-description" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 text-white" onChange={event => handleItemChange(ii.id, event, "term")}/>
                      </div>
                      <div>
                          <label class="block mb-2 text-sm font-medium text-gray-300">Definition</label>
                          <input type="text" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 bg-gray-600 border-gray-500 text-white" onChange={event => handleItemChange(ii.id, event, "definition")}/>
                      </div>
                      <div class="pl-2 cursor-pointer flex flex-row pt-8" onClick={() => removeInputItem(ii.id)}>
                      <MinusIcon class="text-white h-7 w-7 px-1 bg-gray-600 rounded-full cursor-pointer transition ease-in-out hover:scale-110"/>
                      </div>
                      </div>))}
                      <button class="w-full text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create this deck!</button>
                  </form>
              </div>
          </div>
      </div>
  </div>
  )}
  
  {editDeck && <EditDeck id={editDeckId}/>}
  {!addDisabled ? (
<div class="absolute bottom-0 right-0 mb-8 mr-8 bg-gray-600 rounded-full px-3 py-2 transition ease-in-out delay-150 hover:scale-110 cursor-pointer" onClick={() => setShowPopup(true)}>
    <PlusIcon class="text-white h-5 w-5 cursor-pointer"/>
    </div>
    ) : ""}

    </div>
    </div>}
    </>
      )
}

export default home