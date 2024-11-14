import { useLocation, useNavigate } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import s from "./winner.module.scss"
import { updateAllCards } from "../../supabase/updateAllCards"
import { putEmptyCard } from "../../supabase/putEmptyCard"
import { FunctionsContext, VariablesContext } from "../Context/Context"

export default function Winner() {
  const navigate = useNavigate()
  const location = useLocation()
  const { appId, users } = useContext(VariablesContext)
  const { setUsers } = useContext(FunctionsContext)
  const [user] = useState(users.find((user) => user.app_id === appId))

  //* tu dostaję gracza, który wygrał to nie koniecznie muszę być ja
  const { userObject } = location.state || {}

  const updateDatabase = async () => {
    await updateAllCards(userObject)
    await putEmptyCard(user.id)
  }
  const cleanDatabase = async () => {
    if (user) {
      await putEmptyCard(user.id)
    }
  }

  const handleClick = () => {
    navigate("/")
  }

  useEffect(() => {
    if (userObject.app_id === appId) {
      //* wysyłam mój stan do bazy danych i czyszczę moje pola
      console.log("moja wygrana z mojego dashboarda")
      updateDatabase()
    } else {
      console.log("jestem w else przyleciało obce appId obca wygrana")
      cleanDatabase()
    }

    return () => {
      setUsers([])
    }
  }, [])

  return (
    <div
      className={s.winner_container}
      style={{ borderColor: userObject?.table }}
    >
      <h1 style={{ color: userObject?.table }}>Wygrywa {userObject?.table}</h1>
      <button onClick={handleClick}>Wróć na stronę startową</button>
      
    </div>
  )
}
