/* eslint-disable react/prop-types */
import s from "./hand.module.scss"
import cards from "../../functions/cards"
import getRandomCards from "../../functions/getRandomCards"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faRotate } from "@fortawesome/free-solid-svg-icons"

export default function Hand({
  setHandCard,
  setInfo,
  locYourTurn,
  handWithCards,
  setHandWithCards,
}) {
  const [randomCards, setRandomCards] = useState(getRandomCards(cards, 3))
  const [selectedCards, setSelectedCards] = useState([])
  const [lockRerol, setLockRerol] = useState(false)

  //todo tutaj skończyłem chcę uniemożliwic zaznaczanie kart jeśli nie twoja tura
  const handlePhotoClick = (cardNumber, cardName, index) => {
    if (lockRerol) return // zablokowanie ponownego losowania
    setHandCard([cardNumber, cardName]) //todo tu blokada tylko na jedną kartę ???
    setSelectedCards((prevSelected) =>
      prevSelected.includes(index)
        ? prevSelected.filter((i) => i !== index)
        : prevSelected.length < 3
        ? [...prevSelected, index]
        : [...prevSelected.slice(1), index]
    )
  }
  useEffect(() => {
    //jak przyjdzie moja kolej to odblokowuję możliwość wymiany kart jak nie moja kolej to nie
    if (!locYourTurn) {
      setLockRerol(true)
      setSelectedCards([])
    } else {
      setLockRerol(false)
    }
  }, [locYourTurn])

  useEffect(()=>{
    setHandWithCards(randomCards)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[randomCards])

  const rerollSelectedCards = () => {
    if (!lockRerol) {
      setRandomCards((prevCards) =>
        prevCards.map((card, index) =>
          selectedCards.includes(index) ? getRandomCards(cards, 1)[0] : card
        )
      )
      setSelectedCards([])
      setLockRerol(true) //zablokuj ponowne losowanie
      setInfo((prv) => ({ ...prv, action: "wymieniłeś karty, zakończ turę" }))
    } else {
      //informacja że można wymienić karty tylko raz
      setSelectedCards([]) // odznacz karty
      setInfo((prv) => ({
        ...prv,
        instruction: "możesz wymienić karty tylko raz"
      }))
    }
  }

  return (
    <div className={s.hand_container}>
      {handWithCards.map((card, index) => (
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
