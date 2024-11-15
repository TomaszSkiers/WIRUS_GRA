import React, { useContext } from 'react'
import s from './handleEndTurn.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { FunctionsContext, VariablesContext } from '../Context/Context'
import { injectNewTime } from "../../supabase/injectNewTime"
import getRandomCards from "../../functions/getRandomCards"
import { updateCards } from "../../supabase/updateCards"
import cards from "../../functions/cards"

function HandleEndTurn() {
    const {
        tableCard,
        users,
        appId,

    } = useContext(VariablesContext)

    const {
        
        handleSetInfo,
        setHandCard,
        setHandBlocker,
        setHandWithCards,

    }= useContext(FunctionsContext)

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
    <button 
        className={s.handle_end_turn_button}
        onClick={handleEndTurn}    
    >
        <FontAwesomeIcon icon={faCheck}/>
    </button>
  )
}
export default React.memo(HandleEndTurn)