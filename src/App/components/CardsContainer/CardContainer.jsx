/* eslint-disable react/prop-types */
import { useState } from "react"
import s from "./cardContainer.module.scss"

export default function CardContainer({
  user,
  userId,
  color,
  setClickProtection,
  clickProtection
}) {
  const [selectedCard, setSelectedCard] = useState(null) // Przechowuje indeks klikniętej karty

  const handlePhotoClick = (index) => {
    // Jeśli kliknięta karta jest już wybrana, odznacz ją
    setClickProtection(color)
    setSelectedCard((prevSelected) => (prevSelected === index ? null : index))
    
  }

  return (
    <div className={s.player_cards_wrapper}>
      <h3>app_id_: {userId}</h3>
      <div className={s.photos_wrapper} style={{ backgroundColor: color }}>
        {[user.k1, user.k2, user.k3, user.k4].map((card, index) => (
          <img
            key={index}
            className={s.photo}
            src={`./photos/${card}.png`}
            onClick={() => handlePhotoClick(index)}
            style={{
              backgroundColor: selectedCard === index && clickProtection === color ? "gray" : color // Zmieniamy kolor tła w zależności od wyboru
            }}
          />
        ))}
      </div>
    </div>
  )
}
