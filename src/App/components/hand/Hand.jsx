import s from "./hand.module.scss"
import cards from "../../functions/cards"
import getRandomCards from "../../functions/getRandomCards"
import { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate } from "@fortawesome/free-solid-svg-icons"

export default function Hand({ setHandCard }) {
  const [randomCards, setRandomCards] = useState(getRandomCards(cards, 3))
  const [selectedCards, setSelectedCards] = useState([])

  const handlePhotoClick = (cardNumber, cardName, index) => {
    setHandCard([cardNumber, cardName])//todo tu blokada tylko na jedną kartę
    setSelectedCards((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : prevSelected.length < 3
        ? [...prevSelected, index]
        : [...prevSelected.slice(1), index]
    )
  }

  const rerollSelectedCards = () => {
    setRandomCards((prevCards) =>
      prevCards.map((card, index) =>
        selectedCards.includes(index) ? getRandomCards(cards, 1)[0] : card
      )
    )
    setSelectedCards([])
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
            backgroundColor: selectedCards.includes(index) ? "gray" : "black"
          }}
        />
      ))}
      <button onClick={rerollSelectedCards}>
        <FontAwesomeIcon icon={faRotate} /> 
      </button>
    </div>
  )
}
