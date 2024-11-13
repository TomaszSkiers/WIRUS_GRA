import React, { useCallback, useContext, useEffect, useState } from "react"
import s from "./timer.module.scss"
import { FunctionsContext, VariablesContext } from "../Context/Context"

function Timer() {
  const [counter, setCounter] = useState(30)
  const {users, tableCardCopy, appId} = useContext(VariablesContext)
  const {handleSetInfo} = useContext(FunctionsContext)
 

  // console.log(tableCardCopy)

  const decrementCount = useCallback(() => setCounter((prv) => prv - 1), [])

  useEffect(() => {
    const interval = setInterval(() => {
        decrementCount()
    }, 1000)

    return () => {
        clearInterval(interval)
    }
  }, [decrementCount])

  return <h2 className={s.timer}> czas do końca tury: {counter}</h2>
}
export default React.memo(Timer)


// const handleEndTurn = async () => {
//   console.log("zmienna table card", tableCard)

//   const index = users.findIndex((user) => user.id === tableCard[0])
//   if (tableCard) {
//     //wysłanie kart tylko jak karta została wybrana
//     const card = users[index][`k${tableCard[1] + 1}`] //to jest karta
//     await updateCards(tableCard[0], `k${tableCard[1] + 1}`, card)
//   }

//   //tu muszę najpierw zaktualizować w bazie dane dla stolika a później przesłać czas żeby wymusić kolejność
//   await injectNewTime(appId)

//   handleSetInfo('karty wysłane')

//   //czyszczę hancCard
//   setHandCard(false)
//   //odblokowuję klikanie na ręku
//   setHandBlocker(false)
//   //losowanie nowej karty tylko jednej w tym przypadku
//   setHandWithCards((prv) =>
//     prv.map((card) =>
//       card === "empty-card" ? getRandomCards(cards, 1)[0] : card
//     )
//   )
// }