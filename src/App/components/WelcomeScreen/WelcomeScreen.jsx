import { useNavigate } from "react-router-dom"
import s from "./welcomeScreen.module.scss"
import { useContext, useEffect } from "react"
import { setNullToAppId } from "../../supabase/setNullToAppId"
import { FunctionsContext, VariablesContext } from "../Context/Context"

import { eraseData } from "../../supabase/eraseData"

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const { deactivateSubscription } = useContext(FunctionsContext)
  const { appId} = useContext(VariablesContext)

  useEffect(() => {
    // Dezaktywacja subskrypcji przy zamontowaniu
    deactivateSubscription()

    const updateAppId = async () => {
      // sprzątanie po wyjściu z gry
      const dataFromLocalStorage = localStorage.getItem("userData")
      if (dataFromLocalStorage === "false") return
      if (dataFromLocalStorage) {
        //jeżeli jest appId to wprowadź w bazie w jego miejsce null
        //todo await setNullToAppId(dataFromLocalStorage) //tu zmieniłem !!!
        await setNullToAppId(appId)
        //poczekaj na zapis do bazy danych i zatrzyj id o localStorage
        localStorage.setItem("userData", false)
        // console.log('to tutaj zadziałało')
      } else {
        //jeżeli zmienna nie istnieje to ustaw false bo nie wejdziesz do gry
        localStorage.setItem("userData", false)
      }
    }
    updateAppId()

    const test = async () => {
      try {
        await eraseData()
      } catch (error) {
        console.log(error, "coś nie tak w funkcji getAllRecordsWithApp_id")
      }
    }

    test()
  }, [])

  return (
    <div className={s.container}>
      <h1>Virus</h1>

      <button
        onClick={() => {
          navigate("dashboard")
        }}
      >
        START
      </button>
    </div>
  )
}
