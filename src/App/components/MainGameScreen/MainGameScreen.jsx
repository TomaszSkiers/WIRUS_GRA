import s from "./mainGameScreen.module.scss"
import { updateActiveUser } from "../../supabase/updateActivUser"
import { getActiveUsers } from "../../supabase/getActiveUsers"
import { useEffect,  useState } from "react"
import { useNavigate } from "react-router-dom"
import CardContainer from "../CardsContainer/CardContainer"
import supabase from "../../supabase/supabase"

export default function MainGameScreen() {
  const [active, setActive] = useState(false) //czy użytkownik jest aktywny czy nie
  const [userData, setUserData] = useState(null) //dane użytkownika z localStorage
  const [activeUsers, setActiveUsers] = useState([])
 
 
  const navigate = useNavigate()


  useEffect(() => {
    const userDataFromStorage = localStorage.getItem("userData")
    if (userDataFromStorage) {
      setUserData(JSON.parse(userDataFromStorage))
      // setActive(true) // *tu usunąć dodałem dla testów żeby uruchamiać główny ekran
    }

  
      const subscription = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "users" },
        (payload) => {
          console.log("grzebanie w payload", payload.new)
          //todo trzeba zrobić aktualizację stanu activeUsers
          // jeśli pojawił się nowy aktywny użytkownik
          // aktualizuję stan activeUsers
          if (payload.new.active === true) {
            //dodaję do tablicy i filtruję czy się nie dodały dwa razy
          }
        }
      )
      .subscribe()
    
    

    return () => {
      handleEndGame() // ustawienie użytkownika jako nieaktywny
      subscription.unsubscribe() //usunięcie subskrypcji
    }
  }, [])

  // ustawienie użytkownika w stan aktywny
  useEffect(() => {
    if (userData) {
      // console.log(userData.id.id, "<< debugger")
      updateActiveUser(userData.id.id, true)
        .then((data) => {
          if (data) setActive(true)
        })
        .catch((error) =>
          console.error("Błąd podczas aktywacji użytkownika:", error)
        )
      //* tu modę wykorzystać zwrócone dane !! ale jest tylko jeden ostatni rekord
    }
  }, [userData])

  useEffect(() => {
    //pobranie aktywnych użytkowników
    if (!active) return //jak active false to zakończ
    async function fetchActiveUsers() {
      const activeUsers = await getActiveUsers() // czekamy na wynik zapytania

      if (activeUsers.length > 0) {
        console.log("Aktywni użytkownicy:", activeUsers) // Wyświetla aktywnych użytkowników
        setActiveUsers(activeUsers) //zapis do stanu
      } else {
        console.log("Brak aktywnych użytkowników lub wystąpił błąd.")
      }
    }
    fetchActiveUsers() //*wyłączm odpytywanie z bazy danych
  }, [active])

  useEffect(() => {
    if (activeUsers.length === 0) return //gdy nie ma użytkowników

    //ustawianie aktywnego rozgrywającego i wpisanie kolejności gracza
    const quarterback = async () => {
      if (activeUsers.length === 1) {
        //gdy jestem pierwszy
        const { error } = await supabase
          .from("users")
          .update({ quarterback: true, order: 1 })
          .eq("id", userData.id.id)

        if (error) {
          console.log("Błąd przy nadawaniu quarterback:", error.message)
        }
      }
    }
    quarterback()

    //ustawianie kolejności 2 gracza
    const secondOrder = async () => {
      if (activeUsers.length === 2) {
        //gdy jestem drugi
        const { error } = await supabase
          .from("users")
          .update({ order: 2 })
          .eq("id", userData.id.id)

        if (error) {
          console.log("Błąd przy nadawaniu quarterback:", error.message)
        }
      }
    }
    secondOrder()
    //ustawianie kolejności 2 gracza
    const thirdOrder = async () => {
      if (activeUsers.length === 3) {
        //gdy jestem drugi
        const { error } = await supabase
          .from("users")
          .update({ order: 3 })
          .eq("id", userData.id.id)

        if (error) {
          console.log("Błąd przy nadawaniu quarterback:", error.message)
        }
      }
    }
    thirdOrder()
  }, [activeUsers])

  // Funkcja obsługująca zakończenie gry
  // ustawia gracza jako nieaktywny po zakończeniu gry
  //* tu trzeba zrobić ustawienie jako nieaktywny po jakimś czasie lub po zamknięciu strony
  async function handleEndGame() {
    if (userData) {
      const response = await updateActiveUser(userData.id.id, false)
      if (response) {
        setActive(false)
        navigate("/") // Przekierowanie na ekran powitalny
      } else {
        console.error("something went wrong during ending the game")
      }
    }
  }

  return (
    <div className={s.m_g_s_contaniner}>
      {active ? (
        <>
          <div className={s.info_container}>
            <p>now it is Ninka turn</p>
            <button
              onClick={handleEndGame} //* zablokowałem żeby nie generować niepotrzebnych zapytań
              className={s.end_game_button}
            >
              End Game
            </button>
          </div>
          <div className={s.players_cards_wrapper}>
            {activeUsers.map((user) => {
              return <CardContainer key={user.id} userName={user.name} />
            })}
          </div>
        </>
      ) : (
        "Something went wrong with activating the user"
      )}
    </div>
  )
}
