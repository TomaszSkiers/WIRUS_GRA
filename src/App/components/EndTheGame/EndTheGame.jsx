import React, { useContext } from "react"
import s from "./endTheGame.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FunctionsContext } from "../Context/Context"
import { useNavigate } from "react-router-dom"

function EndTheGame() {
  const { setSwitchButtons } = useContext(FunctionsContext)
  const navigate = useNavigate()
  const endTheGame = () => {
    setSwitchButtons(false)
    navigate("/", { replace: true })
  }
  return (
    <button className={s.end_the_game_button} onClick={endTheGame}>
      <FontAwesomeIcon icon={faCircleXmark} />
    </button>
  )
}
export default React.memo(EndTheGame)
