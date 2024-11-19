import React, { useContext } from "react"
import s from "./joinTheGame.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons"
import { injectAppId } from "../../supabase/injectAppId"
import { FunctionsContext, VariablesContext } from "../Context/Context"
import { checkIfMyAppIdExists } from "../../supabase/checkIfMyAppIdExists"
import { removeAllMyAppIdRecordsFromGarbages } from "../../supabase/removeAllMyAppIdRecordsFromGarbages"

function JoinTheGame() {
  const { setSwitchButtons } = useContext(FunctionsContext)
  const { appId, switchButtons } = useContext(VariablesContext)

  const joinTheGame = async () => {
    setSwitchButtons(true)

    //muszę tu rozbudować logikę i najpierw sprawdzić czy w bazie danych nie ma już mojego appId - aplikacji
    //bo jak jest to to muszę sobie pobrać jego id i z niego korzystać żeby kolejny raz nie wpisać swjego appId
    // to wyszło z testów mi taki scenariusz istnieje i blokuje mi grę

    //ok sprawdzam czy w bazie nie istnieje rekord z moim appId, jeśli istnieje to co? hmm... to tak jak bym już był zalogowany i
    //to pomijam etap wstrzeliwania mojego appId bo przecież jakimś cudem kurwa juz tam jest
    const ifExist = await checkIfMyAppIdExists(appId)
    if (ifExist) {
      // console.log(ifExist, "podglądam co tam się dzieje")
      await removeAllMyAppIdRecordsFromGarbages(appId)
    }
    await injectAppId(appId)
  }

  if (!switchButtons) {
    return (
      <button className={s.join_the_game_button} onClick={joinTheGame}>
        <FontAwesomeIcon icon={faRightFromBracket} />
      </button>
    )
  } else {
    null
  }
}
export default React.memo(JoinTheGame)
