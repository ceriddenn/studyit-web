import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import supabase from '../../../lib/supabase'
import { setRequestMeta } from 'next/dist/server/request-meta'
import Sidebar from '../../../components/Sidebar'
const quickstudy = () => {
  const router = useRouter()
  const {query} = useRouter()
  const deckId = query.id;

  //global const
  const [originalDeck, setOriginalDeck] = useState([{}]) //original deck including contents branch
  const [num, setNum] = useState(0)
  const [loading, setLoading] = useState(false)
  const [deckContents, setDeckContents] = useState([{}]) //contents branch
  const [questionAnswers, setQuestionAnswers] = useState([]) //full deck contents;
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0)
  const [finished, setFinished] = useState(false)
  const [reset, setReset] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)
  const [selected, setSelected] = useState(null)
  const [q,setQ] = useState("")
  //score
  const [firstScore, setFirstScore] = useState(0)
  const [finalScore, setFinalScore] = useState(0)

  const Reset = (event) => {
    event.preventDefault()
    setLoading(true)
    setReset(reset + 1)
    setNum(0)
    setQuestionAnswers([])
    setCorrectAnswerIndex(0)
    setFinished(false)
    setFirstScore(0)
    setFinalScore(0)
  }
  //mechanics
  //- get full deck
  //- get random term
  // -get two random deck answers and put them in an array;
  //when next question is pressed reset the secondary deck and get two more random questions;
  // if only 1 set then set the question as true or false
  const getTwoRandomElements = (array1, num) => {
    let array = array1;
    var currentQuestion = num;
    var randomnumber = Math.floor(Math.random() * (2 - 0 + 1)) + 0;
    const randomIndex = Math.floor(Math.random() * array.length)
    const randomIndex2 = Math.floor(Math.random() * array.length)
    // checks if the function returns the same index
    if (randomIndex === randomIndex2) {
      return getTwoRandomElements(array, currentQuestion)
    }
    // checks if the random indexes are equal to the current question
     if ((randomIndex === currentQuestion || randomIndex2 === currentQuestion) || (randomIndex === currentQuestion && randomIndex2 === currentQuestion)) {
      return getTwoRandomElements(array, currentQuestion)
    }
    const randomElement = array[randomIndex].definition
    const randomElement2 = array[randomIndex2].definition
    const correctAnswer = array[currentQuestion].definition
    const array2 = [randomElement, randomElement2, correctAnswer]
    //shuffles the final array
    const finalArray = array2.sort(() => Math.random() - 0.5)
    setCorrectAnswerIndex(correctAnswer)
    return finalArray
  }

  useEffect(() => {
    if (!router.isReady) return;
    localStorage.setItem("currentDeck", deckId)

    setLoading(true)
    setNum(0)
    async function query() {
      await supabase.from("StudyDeck").select("*").match({deckId: deckId}).then(async res => {
        // check if there is result or empty
        if (!res.data[0]) {
          supabase.auth.signOut()
          router.push('/')
        }
        setOriginalDeck(res.data[0])
        const nums = getTwoRandomElements(res.data[0].contents, num)
        setDeckContents(res.data[0].contents)
        setQuestionAnswers(nums)
        setFirstScore(res.data[0].contents.length)
      })

    }

    query();
    setLoading(false)
  }, [router.isReady, reset, deckId])
  const [upS, setUps] = useState(1)

  const nextQuestion = async (event) => {
      event.preventDefault()
      setNum(num + 1)
      setIsDisabled(false)
      setSelected(null)
      const newNum = num + 1
      if (q == correctAnswerIndex) {
        setUps(upS + 1)
        console.log(upS, firstScore)
      } else if (q !== correctAnswerIndex){
        setUps(upS--)
        console.log(upS, firstScore)
      }
      if (newNum === originalDeck.contents.length) {
        setFinished(true)
        //redo this algorithm to get the final score
        setFinalScore(Math.round(upS / firstScore * 100))
        //
      } else {
      const data = getTwoRandomElements(originalDeck.contents, newNum)
      setQuestionAnswers(data)

      }

  }
  
  const answerSelect = async (event, q, i) => {
    event.preventDefault()
    setQ("")
    setSelected(i)
    setIsDisabled(true)
    setQ(q)
  }

  return (
    <>
    <div className='flex'>
    <Sidebar/>
    <div className='container mx-auto h-screen w-full overflow-x-hidden overflow-y-hidden'>
    {finished && (
    <h1 className='flex flex-col justify-center items-center h-full text-black font-semibold text-3xl'>Your Score: {finalScore}</h1>
    )}
    <div className={finished ? 'flex flex-col justify-center items-center h-full blur-sm' : 'flex flex-col justify-center items-center h-full'}>
    <div className='flex mb-12 font-bold text-blue-600 text-2xl'>{finished ? "Finished" : deckContents[num] && deckContents[num].term}</div>
      <div className='flex flex-row gap-6 mr-4 ml-4 mx-auto max-w-[75%] overflow-none'>
      {questionAnswers.map((q,i) => {

        return (
          <div key={i} className="flex">
            {!finished && 
            <button key={i} className={selected === i ? "py-4 px-6 bg-gray-400 text-black text-2xl font-semibold rounded-md transition ease-in-out scale-125" : "py-4 px-6 bg-gray-400 text-black text-2xl font-semibold rounded-md" } onClick={event => {answerSelect(event, q, i);}}>{q}</button>}
          </div>
        )
      })}
      </div>
      <div className='flex flex-row gap-4 mt-6'>
      <button className='py-2 px-4 bg-yellow-400 text-black rounded-md text-md'>Back Question</button>
      <button className='py-2 px-4 bg-yellow-400 text-black rounded-md text-md' onClick={event => nextQuestion(event)}>Next Question</button>
      </div>
      </div>
      
      </div>

    </div>
    
    </>
  )
}

export default quickstudy