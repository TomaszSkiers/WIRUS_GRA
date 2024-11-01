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
    //zaznaczanie i odznaczanie klikniętej karty na stole
    //oraz zaznaczanie i odznaczanie przy przejściu na inny stolik
    setClickProtection(color) //przekazuję kolor stolika do Dashboard
    setSelectedCard((prevSelected) => (prevSelected === index ? null : index))

    //*
  }

  return (
    <div className={s.player_cards_wrapper}>
      
      <div className={s.photos_wrapper} style={{ backgroundColor: color }}>
        {[user.k1, user.k2, user.k3, user.k4].map((card, index) => (
          <img
            key={index}
            className={s.photo}
            src={`./photos/${card}.png`}
            onClick={() => handlePhotoClick(index)}
            style={{
              backgroundColor:
                selectedCard === index && clickProtection === color
                  ? "gray"
                  : color // Zmieniamy kolor tła w zależności od wyboru
            }}
          />
        ))}
      </div>
    </div>
  )
}
