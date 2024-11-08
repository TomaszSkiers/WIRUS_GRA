import { useLocation, useNavigate } from "react-router-dom"

import { useEffect } from "react"
import { setNullToAppId } from "../../supabase/setNullToAppId"
import s from "./winner.module.scss"
import { updateAllCards } from "../../supabase/updateAllCards"

export default function Winner() {
  const navigate = useNavigate()
  const location = useLocation()

  const { userObject, myId } = location.state || {}

  useEffect(() => {
    const cleanId = async () => {
      await updateAllCards(userObject)
      await setNullToAppId(myId)
    }
    cleanId()
  }, [])

  return (
    <div 
      className={s.winner_container}
      style={{borderColor: userObject.table}}
      
      >
      <h1
        style={{color: userObject.table}}
      >Wygrywa {userObject?.table}</h1>
      <button
        onClick={() => {
          navigate("/", { replace: true })
        }}
      >
        Zagraj jeszcze raz
      </button>
    </div>
  )
}
//przy przejściu z powrotem strzałkami nawigacji -> wstecz 