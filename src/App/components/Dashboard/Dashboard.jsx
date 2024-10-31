/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
import { generateSimpleID } from "../../functions/simpleID"
import { injectAppId } from "../../supabase/injectAppId"
import supabase from "../../supabase/supabase"
import Tables from "../tables/tables"
import { injectNewTime } from "../../supabase/injectNewTime"

// import { useNavigationWarning } from "../../functions/useNavigationWarning"

export default function Dashboard() {
  const [appId] = useState(generateSimpleID())
  const [switchButtons, setSwitchButtons] = useState(false)
  const [users, setUsers] = useState([])
  const [locId, setLocId] = useState(false) //blokuje ponowne zapisywanie Id do localStorage
  const [locFetAcUsers, setlocFetAcUsers] = useState(false) //blokuje ponowne pobieranie całej tabeli
  const [locYourTurn, setLocYourTurn] = useState(false)
  const [quarterback, setQuarterback] = useState(false) //*dodano do testów
  const navigate = useNavigate()

  useEffect(() => {
    // przekierowanie po przeładowaniu strony
    const dataFromLocalStorage = localStorage.getItem("userData")
    if (dataFromLocalStorage !== "false") navigate("/") //przekieruj na ekran startowy a tam się znuluje baza

    const fetchActiveUsers = async () => {
      //f. do pobierania wszystkich użytkowników cały stan gry tylko na początku jeden raz
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .not("app_id", "is", null)

      if (error) {
        console.error("Błąd podczas pobierania aktywnych użytkowników:", error)
      } else {
        setUsers(data) //zapisz stan gry do stanu
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
            if (!locFetAcUsers) {//* tu mogę sprawdzić czy users.lenght === 1
              // jak dołączam do gry pobieram wszystkich userów później będę na bieżąco aktualizował stan
              await fetchActiveUsers()
              setlocFetAcUsers(true) //wyłączm ponowne pobieranie wszystkich graczy muszę to zrobić tylko na początku później oszczędzam zapytania do bazy danych
            } else {//* to dopiero sie wykona po aktualizacji  
              setUsers(
                (
                  prv //todo jak wlecą wiadomości odemnie to mój stan też trzeba zaktualizować -> czas
                ) =>
                  prv.map(
                    (
                      user //jak znajdzisz w stanie obiekt z moim ID to go zaktualizuj
                    ) =>
                      user.id === payload.new.id
                        ? { ...user, ...payload.new }
                        : user
                  )
              )
            } //todo --- > testujemy na przykładzie czasu --> time w bazie danych
          } else {
            // tutaj filtrowanie obcych id
            // jak wleci obce id aktualizuję sobie stan gry/ userów
            // todo tu wleci mój aktualy stan z kartami i czasem ja jestem najpóźniej w stanie gry więc aktywny jest teraz najwcześniejszy user
            setUsers((prv) => {
              // aktualizacja stanu users (stanu gry)
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

  useEffect(() => {
    //todo sortowanie po czasie
    const usersSortedByTime = [...users].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    )
    console.log(usersSortedByTime)

    //np: jeżeli id jest równe mojemu to odblokowuję ekran i mója kolej

    if (usersSortedByTime[0]?.app_id === appId) { //todo <<<
      setLocYourTurn(true)
    }else{
      setLocYourTurn(false) //todo <<<<
    }
    setQuarterback(usersSortedByTime[0])
  }, [users]) //todo  << testowanie

  const handleEndTurn = () => {
    injectNewTime(appId)  //todo <<<--
  }

  return (
    <div className={s.dashboard_container}>
      {!switchButtons ? (
        <button onClick={joinTheGame}>DOŁĄCZ DO GRACZY</button>
      ) : (
        <button onClick={endTheGame}>WYJDŹ Z GRY</button>
      )}

      {!locYourTurn ? (
        <span style={{ color: "red" }}>CZEKAJ NA RUCH</span>
      ) : (
        <button onClick={handleEndTurn}>ZAKOŃCZ TURĘ</button> //todo tu przekazać rozgrywającego tu ustawiam czas i wysyłam do bazy zobaczymy jak się posortuje i jak zadziała
      )}

      <h3 style={{ color: "white" }}>
        {quarterback?.app_id} rozgrywający to {quarterback?.table}{" "}
        {/*dodano do testów*/}
      </h3>

      <Tables users={users} />
    </div>
  )
}
//jeszcze jest coś co  sie wykonuje asynchronicznie