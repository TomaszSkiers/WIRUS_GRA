/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
import Tables from "../tables/tables"
import Hand from "../hand/hand"
import Timer from "../Timer/Timer"
import Info from "../Info/Info"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCircleXmark,
  faHourglassHalf,
  faRightToBracket
} from "@fortawesome/free-solid-svg-icons"
import { injectAppId } from "../../supabase/injectAppId"

import { FunctionsContext, VariablesContext } from "../Context/Context"
import HandleEndTurn from "../HandleEndTurn/HandleEndTurn"

function Dashboard() {
  const navigate = useNavigate()

  // Contexty
  const { appId, locYourTurn, myTableColor } = useContext(VariablesContext)
  const { setHandCard, setHandBlocker, handleSetInfo } =
    useContext(FunctionsContext)

  // Lokalne stany
  const [switchButtons, setSwitchButtons] = useState(false)

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
          <HandleEndTurn />
        )}
      </div>

      <Info />

      <Tables />
      {switchButtons ? <Hand /> : null}
    </div>
  )
}
export default React.memo(Dashboard)
