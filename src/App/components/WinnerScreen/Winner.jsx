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

  // Wybranie użytkownika na podstawie appId
  const [user] = useState(users.find((user) => user.app_id === appId))

  // Dane gracza, który wygrał
  const { userObject } = location.state || {}

  // Funkcja aktualizująca bazę danych
  const updateDatabase = async () => {
    if (!userObject || !user) {
      console.error("Błąd: Brakuje danych użytkownika lub obiektu zwycięzcy.")
      return
    }

    try {
      console.log("Aktualizuję bazę danych dla zwycięzcy...")
      await updateAllCards(userObject)
      await putEmptyCard(user.id)
      console.log("Aktualizacja zakończona.")
    } catch (error) {
      console.error("Błąd podczas aktualizacji bazy danych:", error)
    }
  }

  // Funkcja czyszcząca dane w bazie
  const cleanDatabase = async () => {
    if (!user) {
      console.error("Błąd: Brak danych użytkownika do czyszczenia.")
      return
    }

    try {
      console.log(`Czyszczę dane użytkownika: ${user.id}`)
      await putEmptyCard(user.id)
      console.log("Czyszczenie zakończone.")
    } catch (error) {
      console.error("Błąd podczas czyszczenia bazy danych:", error)
    }
  }

  // Obsługa kliknięcia przycisku
  const handleClick = () => navigate("/")

  // Efekt wywoływany po zamontowaniu komponentu
  useEffect(() => {
    const handleWinnerLogic = async () => {
      if (!userObject || !userObject.app_id) {
        console.error("Błąd: Brakuje obiektu userObject lub jego app_id.")
        return
      }

      try {
        if (userObject.app_id === appId) {
          console.log("Moja wygrana z mojego dashboarda.")
          await updateDatabase()
        } else {
          console.log("Obce appId, obca wygrana.")
          await cleanDatabase()
        }
      } catch (error) {
        console.error("Błąd w logice zwycięzcy:", error)
      } finally {
        setUsers([])
      }
    }

    handleWinnerLogic()
  }, [userObject, appId, setUsers])

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
