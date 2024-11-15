import React, { useContext } from "react"
import s from "./joinTheGame.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { injectAppId } from "../../supabase/injectAppId"
import { FunctionsContext, VariablesContext } from "../Context/Context"

function JoinTheGame() {
    const {setSwitchButtons} = useContext(FunctionsContext)
    const {appId} = useContext(VariablesContext)

  const joinTheGame = async () => {
    setSwitchButtons(true)
    await injectAppId(appId) //todo nie odpala
  }
  return (
    <button className={s.join_the_game_button} onClick={joinTheGame}>
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  )
}
export default React.memo(JoinTheGame)
