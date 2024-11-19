/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import s from "./dashboard.module.scss"
import Tables from "../tables/tables"
import Hand from "../hand/hand"
import Info from "../Info/Info"

import { FunctionsContext } from "../Context/Context"
import HandleEndTurn from "../HandleEndTurn/HandleEndTurn"
import JoinTheGame from "../JoinTheGame/JoinTheGame"
import EndTheGame from "../EndTheGame/EndTheGame"
import TableColorInfo from "../TableColorInfo/TableColorInfo"
import Hourglass from "../Hourglass/Hourglass"
// import { width } from "@fortawesome/free-solid-svg-icons/fa0"

function Dashboard() {
  const navigate = useNavigate()

  const {
    setUsers,
    setHandCard,
    setHandBlocker,
    handleSetInfo,
    activateSubscription,
  } = useContext(FunctionsContext)

  console.log("dashboard się renderuje")

  useEffect(() => {
    activateSubscription()
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

      setUsers([])
      //*-------------------------------------------------
      //todo  window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  return (
    <div className={s.dashboard_container}>
      <JoinTheGame />
      <EndTheGame />
      <TableColorInfo />
      <Hourglass />
      <HandleEndTurn />
      <Info />
      <Tables />

      <Hand />
    </div>
  )
}
export default React.memo(Dashboard)
