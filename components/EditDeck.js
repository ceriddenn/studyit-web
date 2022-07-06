import React, {useState, useEffect} from 'react'
import supabase from '../lib/supabase'
import {useRouter} from 'next/router'
import {v4 as uuidv4} from 'uuid'
import {PlusIcon, MinusIcon} from '@heroicons/react/outline'
const EditDeck = (props) => {
  const [deckData, setDeckData] = useState([{}])
  const [deckContents, setDeckContents] = useState([{}])
  const router = useRouter()
  const session = supabase.auth.session()

  const [error, setError] = useState(null)

  useEffect(() =>{
    setError(null)
    async function query() {
      await supabase.from('StudyDeck').select('*').match({deckId:props.id}).then(res => {
        setDeckData(res.data)
        setDeckContents(res.data[0].contents)
      })
    }
    query()

  }, [])

  const addInput = () => {
    setDeckContents([...deckContents, { id: uuidv4(), 'term': null, 'definition': null}])
  }

  const handleRemoveInput = (id) => {
    const values = [...deckContents];
    values.splice(values.findIndex(value => value.id === id), 1)
    setDeckContents(values)
    
    }

const handleChangeInput = (id, event, type) => {
  const newInputItems = deckContents.map(i => {
    if(id === i.id) {
      i[type] = event
    }
    return i
  })
  setDeckContents(newInputItems)
}
const handleChangeInput1 = (id, event, type) => {
  console.log(event + "   " + id + "   " + type)
  const newItems = deckData.map(i => {
    if(id === i.deckId) {
      i[type] = event
      
    }
    return i
  })
  setDeckData(newItems)
  console.log(deckData)
}

const initiateEdit = async (event) => {
  console.log(deckData)
  event.preventDefault()
  if (!deckData[0].deckName) {
    setError('No deck name was provided.')
    return;
  }
  if (!deckData[0].description) {
    setError('No deck description was provided.')
    return;
  }
  if (deckContents.length < 1) {
    console.log('k')
    setError('Please add a term/definition.')
    return;
  }
  if (deckContents.length > 0) {
    if (deckContents[0].term.length && deckContents[0].definition) { 
    setError(null)
  await supabase.from('StudyDeck').update({deckName: deckData[0].deckName, description: deckData[0].description, contents: deckContents}).match({deckId:props.id}).then(res => {
    if (res.error) {
      setError('An error occured while connecting to the database. Please try again.')
      return;
    } else {
      window.location.reload()
    }
  })
} else {
  setError("A term/definition wasn't provided")
}
  }
}


  return (
    <div class="flex justify-center overflow-y-auto overflow-x-hidden absolute top-0 right-0 left-0 bottom-0">
    <div class="relative p-4 w-full max-w-md h-full md:h-auto">
        <div class="relative bg-white rounded-lg shadow dark:bg-gray-800">
            <button type="button" class="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" onClick={() => window.location.reload()}>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>  
            </button>
            <div class="py-6 px-6 lg:px-8">
                <h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Edit a Deck</h3>
                <h1 class="mb-2 text-red-500 font-bold">{error !== null && error}</h1>
                <form class="space-y-6 " onSubmit={event => initiateEdit(event)}>
                {deckData.map(d => (
                  <div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Deck Name</label>
                        <input type="text" id="deck-name" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder={d.deckName} onChange={event => handleChangeInput1(d.deckId, event.target.value, "deckName")}/>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Deck Description</label>
                        <input type="text" id="deck-description" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" placeholder={d.description} onChange={event => handleChangeInput1(d.deckId, event.target.value, "description")}/>
                    </div>
    
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Deck Owner</label>
                        <input type="text" placeholder={session.user.id.slice(0, -12) + "************"} class="bg-gray-900 border border-gray-300 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-500 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" disabled/>
                    </div>
                    </div>))}
                    <div class="flex flex-row">
                    <h1 class="text-2xl font-bold text-white">Content</h1>
                    <div class="pl-2 pt-1 cursor-pointer" onClick={() => addInput()}>
                    <PlusIcon class="text-white h-7 w-7 px-1 bg-blue-600 rounded-full cursor-pointer transition ease-in-out hover:scale-110"/>
                    </div>
                    </div>
                    {deckContents.map(ii => (
                    <div class="flex justify-between gap-3" key={ii.id}>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Term</label>
                        <input type="text" id="deck-description" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" placeholder={ii.term} onChange={event => handleChangeInput(ii.id, event.target.value, "term")}/>
                    </div>
                    <div>
                        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Definition</label>
                        <input type="text" class="bg-gray-50 border border-gray-300 text-white text-sm rounded-lg block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:text-white" placeholder={ii.definition} onChange={event => handleChangeInput(ii.id, event.target.value, "definition")}/>
                    </div>
                    <div class="pl-2 cursor-pointer flex flex-row pt-8" onClick={() => handleRemoveInput(ii.id)}>
                    <MinusIcon class="text-white h-7 w-7 px-1 bg-gray-600 rounded-full cursor-pointer transition ease-in-out hover:scale-110"/>
                    </div>
                    </div>))}
                    <button class="w-full text-white bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Confirm Edit</button>
                </form>
            </div>
        </div>
    </div>
</div> 
  )
}

export default EditDeck