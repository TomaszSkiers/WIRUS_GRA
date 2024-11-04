/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
import { generateSimpleID } from "../../functions/simpleID"
import { injectAppId } from "../../supabase/injectAppId"
import supabase from "../../supabase/supabase"
import Tables from "../tables/tables"
import { injectNewTime } from "../../supabase/injectNewTime"
import Hand from "../hand/hand"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck,
  faCircleXmark,
  faHourglassHalf,
  faRightToBracket
} from "@fortawesome/free-solid-svg-icons"
import { updateCards } from "../../supabase/updateCards"

// import { useNavigationWarning } from "../../functions/useNavigationWarning"

export default function Dashboard() {
  const [appId] = useState(generateSimpleID())
  const [switchButtons, setSwitchButtons] = useState(false)
  const [users, setUsers] = useState([])
  const [locId, setLocId] = useState(false) //blokuje ponowne zapisywanie Id do localStorage
  const [locFetAcUsers, setlocFetAcUsers] = useState(false) //blokuje ponowne pobieranie całej tabeli
  const [locYourTurn, setLocYourTurn] = useState(false) //blokuje możliwość gry
  const [quarterback, setQuarterback] = useState(false) //*dodano do testów
  const [handCard, setHandCard] = useState(false) //karta wybrana z ręki
  const [tableCard, setTableCard] = useState(false) //karta wybrana ze stolika
  const [clickProtection, setClickProtection] = useState(false) //zabezpieczenie przed zaznaczeniem dwóch kart na stoliku
  const [myTableColor, setMyTableColor] = useState(false) //używam gdy zaznaczam aktywną kartę przy zmianie stolików
  const [info, setInfo] = useState({ action: "", instruction: "" }) //informacje dla użytkownika do kontenera .info
  const [handWithCards, setHandWithCards] = useState([
    "empty-card",
    "empty-card",
    "empty-card"
  ])
  const [tableBlocker, setTableBlocker] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    // todo <<<<---------------------------start
    // todo zaczęło działać robię commit i trzeba dopieśćić -> wyswietlanie jest teraz wysyłka
    // * tu muszę zaktualizować stan żeby zwizualizować efekt wybierania karty
    //*ten useEffect do testów
    // console.log(handCard)
    // console.log(users)
    // console.log(tableCard, '<<<<<< tutaj')
    // console.log(locYourTurn)

    //sprawdzam czy wybrano organ ,który ma być położony
    if (!handCard) {
      setInfo((prv) => ({
        ...prv,
        instruction: "wybierz najpierw organ, który chcesz położyć"
      }))
      // można dodać jakiś dźwięk niepowodzenia
      return
    }

    if (handCard !== false && tableCard !== false) {
      //* uruchom wstawianie do bazy danych , nie tutaj tylko w handleEndTurn
      //* a tutaj wizualizację dla użytkownika, czyli aktualizacja stanu
      setUsers((prv) =>
        prv.map((user) =>
          user.id === tableCard[0] //jak znajdziesz moj stan kart to
            ? { ...user, [`k${tableCard[1] + 1}`]: handCard[1] } // z pod pole k1 lub k2 lub k3 wstaw wartość z handCard
            : user
        )
      )

      const index = handCard[0] //pobieram index klikniętej karty
      //zmieniam kartę w ręku na pustą dla wizualizacji
      setHandWithCards((prv) => {
        const copy = [...prv]
        copy[index - 1] = "empty-card"
        return copy
      })

      //blokuję możliwość klikania w karty
      setTableBlocker(true)
    }
  }, [tableCard]) // todo << ----------------end

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
          setTableBlocker(false) //wyłączam blokowanie kliknięć na stoliku

          if (payload.new.app_id === appId) {
            //zakładan filtr tylko na moje wiadomości

            if (!locId) {
              // to muszę zapisać tylko raz później zablokować
              localStorage.setItem("userData", payload.new.id)
              setMyTableColor(payload.new.table)
              setLocId(true)
            }
            if (!locFetAcUsers) {
              //* tu mogę sprawdzić czy users.lenght === 1
              // jak dołączam do gry pobieram wszystkich userów później będę na bieżąco aktualizował stan
              await fetchActiveUsers()
              setlocFetAcUsers(true) //wyłączm ponowne pobieranie wszystkich graczy muszę to zrobić tylko na początku później oszczędzam zapytania do bazy danych
            } else {
              //* to dopiero sie wykona po wciśnięciu dołącz do gry jak zostaną pobrani wszyscy gracze (wszyscy gracze są pobierani tylko raz na początku)
              setUsers(
                (
                  prv // jak wlecą wiadomości odemnie to mój stan też trzeba zaktualizować
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
            }
          } else {
            // tutaj filtrowanie obcych id
            // jak wleci obce id aktualizuję sobie stan gry/ userów
            // tu wleci mój aktualy stan z kartami i czasem ja jestem najpóźniej w stanie gry więc aktywny jest teraz najwcześniejszy user
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

    setInfo((prv) => ({
      ...prv,
      action: "naciśnij zieloną strzałkę w lewym górnym rogu ekranu"
    }))

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const joinTheGame = () => {
    setSwitchButtons(true)
    injectAppId(appId)
    setInfo((prv) => ({
      ...prv,
      action:
        "zostałeś zalogowany do bazy danych, jeżeli conajmniej dwa kolorowe stoliki są widoczne możesz zacząć grę, jeżeli nie to poczekaj na resztę graczy, na dole wylosowano trzy karty"
    }))
  }
  const endTheGame = () => {
    setSwitchButtons(false)
    navigate("/")
  }

  useEffect(() => {
    // sortowanie po czasie
    const usersSortedByTime = [...users].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    )
    //* wyświetlam do testów
    // console.log(usersSortedByTime)
    // console.log(users, 'wyświetlam stan users po aktualizacji')

    //np: jeżeli id jest równe mojemu to odblokowuję ekran i mója kolej

    if (usersSortedByTime[0]?.app_id === appId) {
      setLocYourTurn(true)
      setInfo((prv) => ({
        ...prv,
        instruction:
          "twoja kolej połóż karty i zatwierdź znaczkiem haczyka w prawym górnym rogu",
        action: ""
      }))
    } else {
      setLocYourTurn(false)
      setInfo((prv) => ({
        ...prv,
        instruction: "ekran zablokowany do kiedy będzie twoja kolej"
      }))
    }
    setQuarterback(usersSortedByTime[0]) //który stolik rozgrywa
  }, [users])

  const handleEndTurn = async () => {
    //todo muszę wyczyścić kartę w ręku
    // console.log('id plikacji',appId)
    // console.log('zmienna users',users)
    console.log("zmienna table card", tableCard)
    // const index = users.findIndex((user) => user.app_id === appId)
    // console.log('pobieram index usera', index)
    // const card = users[index][`k${tableCard[1] + 1}`] //todo tutaj nie index z hand tylko z table!!! w stanie indeksujesz po table
    // console.log(card)

    // console.log(`k${tableCard[1] + 1}`)

    // todo tu muszę wziąć tylko id z tableCard a resztę to ze stanu !!!
    const index = users.findIndex((user) => user.id === tableCard[0])
    if (tableCard) {
      //wysłanie kart tylko jak karta została wybrana
      const card = users[index][`k${tableCard[1] + 1}`] //to jest karta
      await updateCards(tableCard[0], `k${tableCard[1] + 1}`, card) // todo zawsze idzie pod moje Id a jak zaznaczę inny stolik??
    }

    //tu muszę najpierw zaktualizować w bazie dane dla stolika a później przesłać czas żeby wymusić kolejność
    await injectNewTime(appId)

    setInfo((prv) => ({ ...prv, action: "karty wysłane" }))

    //czyszczę hancCard
    setHandCard(false)
  }

  return (
    <div className={s.dashboard_container}>
      <div className={s.top_buttons_container}>
        {!switchButtons ? (
          <button onClick={joinTheGame}>
            <FontAwesomeIcon icon={faRightToBracket} />
          </button>
        ) : (
          <button onClick={endTheGame}>
            <FontAwesomeIcon icon={faCircleXmark} />
          </button>
        )}
        <div
          className={s.table_color_container}
          style={{ border: `1px solid ${myTableColor}` }}
        >
          <h3>twój stolik to</h3>
          <h2 style={{ color: myTableColor }}>{myTableColor}</h2>
        </div>

        {!locYourTurn ? (
          <span className={s.wait}>
            <FontAwesomeIcon icon={faHourglassHalf} />
          </span>
        ) : (
          <button onClick={handleEndTurn}>
            <FontAwesomeIcon icon={faCheck} />
          </button> //todo tu przekazać rozgrywającego tu ustawiam czas i wysyłam do bazy zobaczymy jak się posortuje i jak zadziała
        )}
      </div>

      <div className={s.info}>
        <p>{info.action}</p>
        <p className={s.instruction}>{info.instruction}</p>
      </div>

      <Tables
        users={users}
        setTableCard={setTableCard}
        setClickProtection={setClickProtection}
        clickProtection={clickProtection}
        setInfo={setInfo}
        lockYourTurn={locYourTurn} //tu literówka trzeba uważać!1
        tableBlocker={tableBlocker}
      />
      {switchButtons ? (
        <Hand
          setHandCard={setHandCard}
          appId={appId}
          setInfo={setInfo}
          locYourTurn={locYourTurn}
          handWithCards={handWithCards}
          setHandWithCards={setHandWithCards}
          setTableBlocker={setTableBlocker}
        />
      ) : null}
    </div>
  )
}
//jeszcze jest coś co  sie wykonuje asynchronicznie
