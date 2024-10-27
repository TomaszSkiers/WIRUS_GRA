import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from "./welcomeScreen.module.scss"
import saveUser from "../../supabase/saveUser"

export default function WelcomeScreen() {
  const [userData, setUserData] = useState(null)
  const [name, setName] = useState(null)
  const navigate = useNavigate()

  const saveUserToLocaleStorage = (id, name) => {
    const userData = { id, name }
    localStorage.setItem("userData", JSON.stringify(userData))
  }
  const loadUserData = () => {
    const data = localStorage.getItem("userData")
    if (data) {
      const userData = JSON.parse(data)
      setUserData(userData.id)
    }
    
  }
  const handleSubmitJoinTheGame = async (e) => {
    e.preventDefault()

    //dodaje użytkownika do bazy danych i zwracam ostatni record
    const userDataFromSupabase = await saveUser(name)
    if (userDataFromSupabase) {
      saveUserToLocaleStorage(userDataFromSupabase)
      setUserData(userDataFromSupabase)
    }

    //tu przekierowanie na stronę gry 
    navigate('mainGameScreen')
  }

  const handleSubmitContinueTheGame = (e) => {
    e.preventDefault()
    navigate('mainGameScreen')
  }

  const handleInput = (e) => {
    setName(e.target.value)
  }
  useEffect(() => {
    console.log(userData)
  }, [userData])

  useEffect(() => {
    loadUserData()
  }, [])

  return (
    <div className={s.container}>
      <h1>Virus</h1>

      {/* <h2 className='debugger'>{name}</h2> */}

      {userData ? (
        //tu mam dane z localStorage
        <form onSubmit={handleSubmitContinueTheGame}>
          <h2>
            hello {userData.name} <br />
            it is nice to see You again
          </h2>
          <button>continue the game</button>
        </form>
      ) : (
        //tu nie mam danych z localstorage
        <form onSubmit={handleSubmitJoinTheGame}>
          <input
            type="text"
            placeholder="enter your name"
            onChange={(e) => {
              handleInput(e)
            }}
          ></input>

          <button type="submit">and join the game</button>
        </form>
      )}
    </div>
  )
}


