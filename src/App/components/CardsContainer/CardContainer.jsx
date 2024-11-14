/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react"
import s from "./cardContainer.module.scss"
import { FunctionsContext, VariablesContext } from "../Context/Context"

export default function CardContainer({
  user,
  userId,
  color,
  setClickProtection,
  clickProtection,
  // lockYourTurn,
  setTableCard,
  // tableBlocker
}) {
  const [selectedCard, setSelectedCard] = useState(null) // Przechowuje indeks klikniętej karty
  const [lockClikc, setLocClic] = useState(false) //blokuje ponowne kliknięcia po ustawieniu organu
  const {handleSetTableCardCopy} = useContext(FunctionsContext)
  const {tableBlocker} = useContext(VariablesContext)
  const {locYourTurn} = useContext(VariablesContext)

  console.log('cardContainer się renderuje')

  const handlePhotoClick = (index) => {
    //klikać nie wolno jak położono kartę
    console.log(locYourTurn)


    if (tableBlocker) return

    // blokowanie onClicka jeśli nie moja tura
    if (!locYourTurn) return

    setTableCard([user.id, index, user[`k${index + 1}`]]) //index, która kliknięta
    
    //zaznaczanie i odznaczanie klikniętej karty na stole
    //oraz zaznaczanie i odznaczanie przy przejściu na inny stolik
    setClickProtection(color) //przekazuję kolor stolika do Dashboard
    setSelectedCard((prevSelected) => (prevSelected === index ? null : index))
    // jak klikniesz to wpisz null żeby odznaczyć
  }

  useEffect(() => {
    //*odznaczam wszystkie karty
    setSelectedCard(null)
  }, [locYourTurn])

  return (
    <div className={s.player_cards_wrapper}>
      <div
        className={s.photos_wrapper}
        style={{
          border: `3px solid ${color}`,
          backgroundColor: color
        }}
      >
        {[user.k1, user.k2, user.k3, user.k4].map((card, index) => (
          <img
            key={index}
            className={s.photo}
            src={`./photos/${card}.png`}
            onClick={() => handlePhotoClick(index)} //przekazuję dla każdej funkcji inny parametr
            style={{
              borderColor:
                selectedCard === index && clickProtection === color
                  ? "red"
                  : color,
              filter:
                selectedCard === index && clickProtection === color
                  ? "brightness(1.2)"
                  : 'brightness(1)'
            }}
          />
        ))}
      </div>
    </div>
  )
}
