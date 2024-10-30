import { useNavigate } from "react-router-dom"
import s from "./welcomeScreen.module.scss"
import { useEffect } from "react"
import { setNullToAppId } from "../../supabase/setNullToAppId"

export default function WelcomeScreen() {
  const navigate = useNavigate()

  useEffect(() => {
    // sprzątanie po wyjściu z gry
    const dataFromLocalStorage = localStorage.getItem("userData")
    if (dataFromLocalStorage === 'false') return
    if (dataFromLocalStorage) {
      setNullToAppId(dataFromLocalStorage)
      localStorage.setItem('userData', false)
    }
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
