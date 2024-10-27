import s from "./mainGameScreen.module.scss"
import { updateActiveUser } from "../../supabase/updateActivUser"
import { getActiveUsers } from "../../supabase/getActiveUsers"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import CardContainer from "../WelcomeScreen/CardsContainer/CardContainer"

export default function MainGameScreen() {
  const [active, setActive] = useState(false)
  const [userData, setUserData] = useState(null)
  const [activeUsers, setActiveUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("userData")
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage))
      setActive(true) // *tu usunąć dodałem dla testów żeby uruchamiać główny ekran
    }
  }, [])

  // ustawienie użytkownika w stan aktywny
  useEffect(() => {
    if (userData) {
      // console.log(userData.id.id, "<< debugger")
      // updateActiveUser(userData.id.id, true)
      //   .then((data) => {
      //     if (data) setActive(true)
      // TODO tu ustawiam stan i po co badać to data !!! od razu można by setActive zrobić do poprawki
      //   })
      //   .catch((error) =>
      //     console.error("Błąd podczas aktywacji użytkownika:", error)
      //   )
      //* tu modę wykorzystać zwrócone dane !! ale jest tylko jeden ostatni rekord
    }
  }, [userData])

  useEffect(() => {
    //pobranie aktywnych użytkowników
    if (!active) return //jak active false to wyskakuj
    async function fetchActiveUsers() {
      const activeUsers = await getActiveUsers() // czekamy na wynik zapytania

      if (activeUsers.length > 0) {
        console.log("Aktywni użytkownicy:", activeUsers) // Wyświetla aktywnych użytkowników
        setActiveUsers(activeUsers)
      } else {
        console.log("Brak aktywnych użytkowników lub wystąpił błąd.")
      }
    }
    fetchActiveUsers()
  }, [active])

  // Funkcja obsługująca zakończenie gry
  // ustawienie gracz jako nieaktywny
  async function handleEndGame() {
    // if (userData) {
    //   const response = await updateActiveUser(userData.id.id, false)
    //   if (response) {
    //     setActive(false)
    //     navigate("/") // Przekierowanie na ekran powitalny
    //   } else {
    //     console.error("something went wrong during ending the game")
    //   }
    // }
  }

  return (
    <div className={s.m_g_s_contaniner}>
      {active ? (
        <>
          <div className={s.info_container}>
            <p>now it is Ninka turn</p>
            <button onClick={handleEndGame} className={s.end_game_button}>
              End Game
            </button>
          </div>
          <div className={s.players_cards_wrapper}>
            {activeUsers.map((user) => {
              return (
                <CardContainer key={user.id} userName={user.name}/>
              )
            })}
          </div>
        </>
      ) : (
        "Something went wrong with activating the user"
      )}
    </div>
  )
}
