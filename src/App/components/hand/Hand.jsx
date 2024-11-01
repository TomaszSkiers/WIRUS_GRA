/* eslint-disable react/prop-types */
import s from "./hand.module.scss"
import cards from "../../functions/cards"
import getRandomCards from "../../functions/getRandomCards"
import { useState } from "react"

export default function Hand({ setHandCard, appId }) {
  const [randomCards, setRandomCards] = useState(getRandomCards(cards, 3))
  const [selectedCard, setSelectedCard] = useState(null) // Przechowuje indeks klikniętej karty

  const handlePhotoClick = (cardNumber, cardName, index) => {
    setHandCard([cardNumber, cardName])

    // Jeśli kliknięta karta jest już zaznaczona, usuń zaznaczenie, w przeciwnym razie zaznacz ją
    setSelectedCard((prevSelected) => (prevSelected === index ? null : index))
  }

  return (
    <div className={s.hand_container}>
      {randomCards.map((card, index) => (
        <img
          key={index}
          className={s.photo}
          src={`./photos/${card}.png`}
          onClick={() => handlePhotoClick(index + 1, card, index)}
          data-number={index + 1}
          style={{
            backgroundColor: selectedCard === index ? "gray" : "black" // Sprawdzenie, czy indeks jest równy selectedCard
          }}
        />
      ))}
      <button>exch</button>
    </div>
  )
}
