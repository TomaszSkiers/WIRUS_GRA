import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
import { generateSimpleID } from "../../functions/simpleID"
import { injectAppId } from "../../supabase/injectAppId"
import supabase from "../../supabase/supabase"

// import { useNavigationWarning } from "../../functions/useNavigationWarning"

export default function Dashboard() {
  const [appId] = useState(generateSimpleID())
  const [switchButtons, setSwitchButtons] = useState(false)
  const [users, setUsers] = useState([])
  const [locId, setLocId] = useState(false) //blokuje ponowne zapisywanie Id do localStorage
  const [locFetAcUsers, setlocFetAcUsers] = useState(false) //blokuje ponowne pobieranie całej tabeli
  const navigate = useNavigate()

  useEffect(() => {
    // przekierowanie po przeładowaniu strony
    const dataFromLocalStorage = localStorage.getItem("userData")
    if (dataFromLocalStorage !== "false") navigate("/") //przekieruj na ekran startowy a tam się znuluje baza

    const fetchActiveUsers = async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .not("app_id", "is", null)

      if (error) {
        console.error("Błąd podczas pobierania aktywnych użytkowników:", error)
      } else {
        setUsers(data)
      }
    }

    // Inicjalizacja subskrypcji
    const subscription = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "update", schema: "public", table: "users" },
        async (payload) => {
          console.log("ładunek z bazy danych", payload.new)

          if (payload.new.app_id === appId) {
            //zakładan filtr tylko na moje wiadomości

            if (!locId) {
              // to muszę zapisać tylko raz później zablokować
              localStorage.setItem("userData", payload.new.id)
              setLocId(true)
            }
            if (!locFetAcUsers) {
              // jak dołączam do gry pobieram wszystkich userów później będę na bieżąco aktualizował stan
              await fetchActiveUsers()
              setlocFetAcUsers(true)
            }
          } else {
            // jak wleci obce id aktualizuję sobie stan gry/ userów
            setUsers((prv) => {
              const index = prv.findIndex((user) => user.id === payload.new.id)

              // Sprawdzamy, czy app_id jest null
              if (payload.new.app_id === null) {
                // Usuwamy użytkownika ze stanu, jeśli app_id jest null
                return prv.filter((user) => user.id !== payload.new.id)
              }

              if (index !== -1) {
                //jeżeli przyleciał user, który już istnieje w stanie, to go aktualizuję
                const updatedUsers = [...prv]
                updatedUsers[index] = { ...updatedUsers[index], ...payload.new }
                return updatedUsers
              } else {
                //jeżeli przyleciał user, którego nie ma w stanie to go dodaję
                return [...prv, payload.new]
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe() //usunięcie subskrypcji
    }
  }, [])

  const joinTheGame = () => {
    setSwitchButtons(true)
    injectAppId(appId)
  }
  const endTheGame = () => {
    setSwitchButtons(false)
    navigate("/")
  }

  return (
    <div className={s.dashboard_container}>
      {!switchButtons ? (
        <button onClick={joinTheGame}>DOŁĄCZ DO GRACZY</button>
      ) : (
        <button onClick={endTheGame}>WYJDŹ Z GRY</button>
      )}
      <h3>Lista Użytkowników:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.app_id} - {user.table}
          </li>
        ))}
      </ul>
    </div>
  )
}
