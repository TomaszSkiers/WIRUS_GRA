import { useNavigate } from "react-router-dom"
import s from "./welcomeScreen.module.scss"
import { useEffect } from "react"
import { setNullToAppId } from "../../supabase/setNullToAppId"

export default function WelcomeScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    const updateAppId = async () => {
      // sprzątanie po wyjściu z gry
      const dataFromLocalStorage = localStorage.getItem("userData")
      if (dataFromLocalStorage === "false") return
      if (dataFromLocalStorage) {
        //jeżeli jest appId to wprowadź w bazie w jego miejsce null
        await setNullToAppId(dataFromLocalStorage)
        //poczekaj na zapis do bazy danych i zatrzyj id o localStorage
        localStorage.setItem("userData", false)
      } else {
        //jeżeli zmienna nie istnieje to ustaw false bo nie wejdziesz do gry
        localStorage.setItem("userData", false)
      }
    }
    updateAppId()
  }, [])

  return (
    <div className={s.container}>
      <h1>Virus</h1>

      <button
        onClick={() => {
          navigate("dashboard", { replace: true })
        }}
      >
        START
      </button>
    </div>
  )
}
