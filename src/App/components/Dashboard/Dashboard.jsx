/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
// import { generateSimpleID } from "../../functions/simpleID"
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
import getRandomCards from "../../functions/getRandomCards"
import cards from "../../functions/cards"
import { checkCards } from "../../functions/checkCard"
import { handleEndOfGames } from "../../functions/handleEndOfGame"
// import { setNullToAppId } from "../../supabase/setNullToAppId"
import Timer from "../Timer/Timer"
import Info from "../Info/Info"
import { FunctionsContext, VariablesContext } from "../Context/Context"

// import { useNavigationWarning } from "../../functions/useNavigationWarning"

function Dashboard() {
  // const [appId] = useState(generateSimpleID())
  const { appId } = useContext(VariablesContext)

  const [switchButtons, setSwitchButtons] = useState(false)

  // const [users, setUsers] = useState([])
  const {users} = useContext(VariablesContext)
  const {setUsers} = useContext(FunctionsContext)



  const [locId, setLocId] = useState(false) //blokuje ponowne zapisywanie Id do localStorage
  const [locFetAcUsers, setlocFetAcUsers] = useState(false) //blokuje ponowne pobieranie całej tabeli
 
  // const [locYourTurn, setLocYourTurn] = useState(false) //blokuje możliwość gry
  const {locYourTurn} = useContext(VariablesContext)
  const {setLocYourTurn} = useContext(FunctionsContext)



  // const [handCard, setHandCard] = useState(false) //karta wybrana z ręki
  const { handCard } = useContext(VariablesContext)
  const { setHandCard } = useContext(FunctionsContext)

  // const [tableCard, setTableCard] = useState(false) //karta wybrana ze stolika
  const {tableCard} = useContext(VariablesContext)
  const {setTableCard} = useContext(FunctionsContext)


  const [clickProtection, setClickProtection] = useState(false) //zabezpieczenie przed zaznaczeniem dwóch kart na stoliku
  const [myTableColor, setMyTableColor] = useState(false) //używam gdy zaznaczam aktywną kartę przy zmianie stolików
  // const [info, setInfo] = useState({ action: "", instruction: "" }) //* przeniosłem do Contextu informacje dla użytkownika do kontenera .info

  // const [handWithCards, setHandWithCards] = useState([
  //   "empty-card",
  //   "empty-card",
  //   "empty-card"
  // ])
  // const {handWithCards} = useContext(VariablesContext)
  const { setHandWithCards } = useContext(FunctionsContext)

  // const [tableBlocker, setTableBlocker] = useState(false)
  // const {tableBlocker} = useContext(VariablesContext)
  const {setTableBlocker} = useContext(FunctionsContext)



  // const [moreThanOneCardChecked, setMoreThanOneCardChecked] = useState(false)
  const {moreThanOneCardChecked} = useContext(VariablesContext)
  const {setMoreThanOneCardChecked} = useContext(FunctionsContext)

  // const [handBlocker, setHandBlocker] = useState(false)
  // const {handBlocker} = useContext(VariablesContext)
  const { setHandBlocker } = useContext(FunctionsContext)

  const navigate = useNavigate()
  const { handleSetInfo } = useContext(FunctionsContext)

  console.log("dashboard się renderuje")

  useEffect(() => {
    //todo << ------------------------------------------------- start useEffect [tableCard]

    const updateCards = async () => {
      //sprawdzam ile zaznaczono kart
      if (moreThanOneCardChecked) {
        //* tu mam renderowanie aktualizacja spowoduje renderowanie wszystkiego jeszcze raz
        handleSetInfo(
          "zaznaczyłeś więcej niż jedną kartę i tu trzeba dokończyć tekst"
        )
        return
      }

      //sprawdzam czy wybrano organ ,który ma być położony
      if (!handCard) {
        handleSetInfo("wybierz najpierw organ, który chcesz położyć")

        // można dodać jakiś dźwięk niepowodzenia
        return
      }

      // tutaj będzie moja funkcja await do sprawdzanaia
      // i rezultat do wstawienia do stanu
      // result [card, info]
      const result = await checkCards(users, handCard, tableCard)

      if (handCard !== false && tableCard !== false) {
        //* uruchom wstawianie do bazy danych , nie tutaj tylko w handleEndTurn
        //* a tutaj wizualizację dla użytkownika, czyli aktualizacja stanu
        // ? { ...user, [`k${tableCard[1] + 1}`]: handCard[1] } // to było poprzednio i działało
        setUsers((prv) =>
          prv.map((user) =>
            user.id === tableCard[0] //jak znajdziesz moj stan kart to
              ? { ...user, [`k${tableCard[1] + 1}`]: result[0] } // z pod pole k1 lub k2 lub k3 wstaw wartość z handCard
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
        setHandBlocker(true)
        // setInfo((prv) => ({ ...prv, action: result[1] }))
      }
    }
    updateCards()
  }, [tableCard]) // todo << ------------------------------------------------- end

  useEffect(() => {
    // todo Dodaję obsługę nieoczekiwaniego zamknięcia strony przez użytkownika
    // window.addEventListener("beforeunload", ()=>{
    //   const myId = users.find((user) => user.app_id === appId)?.id;
    //   supabase.from('users').update({app_id: 'null'}).eq('id', myId)
    // })

    // przekierowanie po przeładowaniu strony
    const dataFromLocalStorage = localStorage.getItem("userData")
    if (dataFromLocalStorage !== "false") navigate("/", { replace: true }) //przekieruj na ekran startowy a tam się znuluje baza

    const fetchActiveUsers = async () => {
      //f. do pobierania wszystkich użytkowników cały stan gry tylko na początku jeden raz
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .not("app_id", "is", null)

      if (error) {
        console.error("Błąd podczas pobierania aktywnych użytkowników:", error)
      } else {
        //* to mogę sprawdzić, który gracz się nie wylogował, jeżeli log będzie starszy niż 30s tzn. że nie gra
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

            //todo ---------- counter
            //*jak przyleci moje id to znaczy że jest tylko jeden gracz to tżeba wyłączyć

            //todo ------------end counter

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
            //todo ------------------------------------------------------------------------------------------------------------  timer
            //informacja o nowych kartach
            handleSetInfo(`gracz ${payload.new.table} zakończył turę`)
            //todo -------------- counter
            //* jak przyleci obce id to przedłużam czas
            // odblokowuję rękę

            //todo ----------------- end counter
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

    handleSetInfo("naciśnij zieloną strzałkę w lewym górnym rogu ekranu")

    return () => {
      subscription.unsubscribe()
      //todo  window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  const joinTheGame = async () => {
    setSwitchButtons(true)
    await injectAppId(appId) //todo nie odpala 
  }
  const endTheGame = () => {
    setSwitchButtons(false)
    navigate("/", { replace: true })
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
      //todo < ----------------------------------------------------- users
      setLocYourTurn(true)
    } else {
      setLocYourTurn(false)
    }

    //* tu mogę wywołać metodę do sprawdzania wygranej i chyba nie zaleznie od usera
    //* mogę zawsze sprawdzić wszystkich; w     Cards handlePhotoClilk aktualizuje tableCards a tableCard aktualizuje users
    //* czyli tu powinno zadziałać
    //* tylko najlepiej żeby sprawdzało wszystkich graczy
    //* jeżeli zwróci mi ID wygranego gracz to jakaś reakcja musi być, tylko jaka?, może komponent kończący z
    //* brawo wygrana teg i tego i przycisk, czy nowa gra?

    const winner = handleEndOfGames(users)
    // console.log("winner", winner)
    // const winner = false
    if (winner) {
      // pobieram gracza który wygrał do wysyłki reszcie
      const userObject = users.find((user) => user.id === winner)

      //wyszukuję siebie
      const myId = users.find((user) => user.app_id === appId)
      navigate("/winner", {
        state: { userObject, myId: myId?.id },
        replace: true
      })
    }

    if (users.length === 1) {
      handleSetInfo("jesteś jedynym graczem poczekaj na pozostałych")
    }
  }, [users]) //todo << --------------------------------------- users

  const handleEndTurn = async () => {
    console.log("zmienna table card", tableCard)

    const index = users.findIndex((user) => user.id === tableCard[0])
    if (tableCard) {
      //wysłanie kart tylko jak karta została wybrana
      const card = users[index][`k${tableCard[1] + 1}`] //to jest karta
      await updateCards(tableCard[0], `k${tableCard[1] + 1}`, card)
    }

    //tu muszę najpierw zaktualizować w bazie dane dla stolika a później przesłać czas żeby wymusić kolejność
    await injectNewTime(appId)

    handleSetInfo("karty wysłane")

    //czyszczę handCard
    setHandCard(false)
    //odblokowuję klikanie na ręku
    setHandBlocker(false)
    //losowanie nowej karty tylko jednej w tym przypadku
    setHandWithCards((prv) =>
      prv.map((card) =>
        card === "empty-card" ? getRandomCards(cards, 1)[0] : card
      )
    )
  }

  return (
    <div className={s.dashboard_container}>
      <div className={s.top_buttons_container}>
        {!switchButtons ? (
          <button onClick={joinTheGame}>
            <FontAwesomeIcon icon={faRightToBracket} />{" "}
            {/**ikonka dołącz do gry */}
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
          <h3 style={{ color: myTableColor }}>
            twój stolik ma kolor {myTableColor}
          </h3>
          <Timer />{" "}
          {/**todo-------------------------------------------------------------- timer */}
          {/**renderowanie czasu bardzo spowolniło wybieranie elementów */}
        </div>

        {!locYourTurn ? (
          <span className={s.wait}>
            <FontAwesomeIcon icon={faHourglassHalf} /> {/**ikonka klepsydry */}
          </span>
        ) : (
          <button onClick={handleEndTurn}>
            <FontAwesomeIcon icon={faCheck} /> {/**znaczek zakończenia tury */}
          </button>
        )}
      </div>

      <Info />

      <Tables
        // users={users}
        setTableCard={setTableCard}
        setClickProtection={setClickProtection}
        clickProtection={clickProtection}
        // lockYourTurn={locYourTurn} //tu literówka trzeba uważać!1
        // tableBlocker={tableBlocker}
      />
      {switchButtons ? (
        <Hand
          // setHandCard={setHandCard}
          // locYourTurn={locYourTurn}
          // handWithCards={handWithCards}//todo
          // setHandWithCards={setHandWithCards}
          // setTableBlocker={setTableBlocker}
          // setMoreThanOneCardChecked={setMoreThanOneCardChecked}
          // handBlocker={handBlocker}
        />
      ) : null}
    </div>
  )
}
export default React.memo(Dashboard)