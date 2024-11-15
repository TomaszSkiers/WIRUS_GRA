/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
// import { generateSimpleID } from "../../functions/simpleID"
import { injectAppId } from "../../supabase/injectAppId"

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
  const { users } = useContext(VariablesContext)
  // const { setUsers } = useContext(FunctionsContext)

 
  // const [locYourTurn, setLocYourTurn] = useState(false) //blokuje możliwość gry
  const { locYourTurn } = useContext(VariablesContext)
  // const { setLocYourTurn } = useContext(FunctionsContext)

  // const [handCard, setHandCard] = useState(false) //karta wybrana z ręki
  // const { handCard } = useContext(VariablesContext)
  const { setHandCard } = useContext(FunctionsContext)

  // const [tableCard, setTableCard] = useState(false) //karta wybrana ze stolika
  const { tableCard } = useContext(VariablesContext)
  // const { setTableCard } = useContext(FunctionsContext)

  // const [clickProtection, setClickProtection] = useState(false) //zabezpieczenie przed zaznaczeniem dwóch kart na stoliku
  // const {clickProtection} = useContext(VariablesContext)
  // const {setClickProtection} = useContext(FunctionsContext)

  // const [myTableColor, setMyTableColor] = useState(false) //używam gdy zaznaczam aktywną kartę przy zmianie stolików
  const { myTableColor } = useContext(VariablesContext)
  // const { setMyTableColor } = useContext(FunctionsContext)

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
  // const { setTableBlocker } = useContext(FunctionsContext)

  // const [moreThanOneCardChecked, setMoreThanOneCardChecked] = useState(false)
  // const { moreThanOneCardChecked } = useContext(VariablesContext)
  // const { setMoreThanOneCardChecked } = useContext(FunctionsContext)

  // const [handBlocker, setHandBlocker] = useState(false)
  // const {handBlocker} = useContext(VariablesContext)
  const { setHandBlocker } = useContext(FunctionsContext)

  const navigate = useNavigate()
  const { handleSetInfo } = useContext(FunctionsContext)

  console.log("dashboard się renderuje")

  useEffect(() => {
    // todo Dodaję obsługę nieoczekiwaniego zamknięcia strony przez użytkownika
    // window.addEventListener("beforeunload", ()=>{
    //   const myId = users.find((user) => user.app_id === appId)?.id;
    //   supabase.from('users').update({app_id: 'null'}).eq('id', myId)
    // })

    // przekierowanie po przeładowaniu strony
    const dataFromLocalStorage = localStorage.getItem("userData")
    if (dataFromLocalStorage !== "false") navigate("/", { replace: true }) //przekieruj na ekran startowy a tam się znuluje baza

    handleSetInfo("naciśnij zieloną strzałkę w lewym górnym rogu ekranu")

    return () => {
      //* to zauważyłem problem przy starcie kładł starą kartę i blokował rękę
      setHandCard(false)
      setHandBlocker(false)
      // setUsers([])
      //*-------------------------------------------------
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
          <Timer />
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

      <Tables />
      {switchButtons ? <Hand /> : null}
    </div>
  )
}
export default React.memo(Dashboard)
