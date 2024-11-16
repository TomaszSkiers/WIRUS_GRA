import React, { useContext, useEffect } from "react"
import s from "./endTheGame.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import { FunctionsContext, VariablesContext } from "../Context/Context"
import { useNavigate } from "react-router-dom"

function EndTheGame() {
  const { setSwitchButtons } = useContext(FunctionsContext)
  const { switchButtons } = useContext(VariablesContext)
  const navigate = useNavigate()

  const endTheGame = () => {
    setSwitchButtons(false)
    navigate("/", { replace: true })
  }

  useEffect(() => {
    return () => {
      setSwitchButtons(false)
    }
  }, [])

  if (switchButtons) {
    return (
      <button className={s.end_the_game_button} onClick={endTheGame}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </button>
    )
  } else {
    null
  }
}
export default React.memo(EndTheGame)
