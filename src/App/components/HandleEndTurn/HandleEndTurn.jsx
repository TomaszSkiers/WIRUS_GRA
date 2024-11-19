import React, { useContext } from "react"
import s from "./handleEndTurn.module.scss"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import { FunctionsContext, VariablesContext } from "../Context/Context"
import { injectNewTime } from "../../supabase/injectNewTime"
import getRandomCards from "../../functions/getRandomCards"
import { updateCards } from "../../supabase/updateCards"
import cards from "../../functions/cards"

function HandleEndTurn() {
  const { tableCard, users, appId, locYourTurn } = useContext(VariablesContext)

  const { handleSetInfo, setHandCard, setHandBlocker, setHandWithCards } =
    useContext(FunctionsContext)

  const handleEndTurn = async () => {
    try {
      console.log("zmienna table card", tableCard)

      // Weryfikacja tableCard
      if (!tableCard || tableCard.length < 2) {
        console.error("Błąd: tableCard jest nieprawidłowe:", tableCard)
        return
      }

      // Znajdź użytkownika po ID
      const index = users.findIndex((user) => user.id === tableCard[0])
      if (index === -1) {
        console.error("Błąd: Nie znaleziono użytkownika z ID:", tableCard[0])
        return
      }

      const user = users[index]
      const cardKey = `k${tableCard[1] + 1}`

      // Sprawdź, czy klucz istnieje w użytkowniku
      if (!(cardKey in user)) {
        console.error(`Błąd: Klucz ${cardKey} nie istnieje w użytkowniku`, user)
        return
      }

      const card = user[cardKey]

      // Wysyłanie karty
      await updateCards(tableCard[0], cardKey, card)

      // Aktualizacja czasu w bazie
      await injectNewTime(appId)

      // Informacja o wysłanych kartach
      handleSetInfo("karty wysłane")

      // Czyszczenie i aktualizacja UI
      setHandCard(false)
      setHandBlocker(false)
      setHandWithCards((prv) =>
        prv.map((card) =>
          card === "empty-card" ? getRandomCards(cards, 1)[0] : card
        )
      )
    } catch (error) {
      console.error("Błąd w handleEndTurn:", error)
    }
  }

  if (locYourTurn) {
    return (
      <button className={s.handle_end_turn_button} onClick={handleEndTurn}>
        <FontAwesomeIcon icon={faCheck} />
      </button>
    )
  } else {
    null
  }
}
export default React.memo(HandleEndTurn)
