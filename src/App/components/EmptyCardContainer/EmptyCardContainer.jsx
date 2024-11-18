// import React from "react"
import s from "./emptyCardContainer.module.scss"

export default function EmptyCardContainer() {
  const cards = ["empty-card", "empty-card", "empty-card", "empty-card"]
  return (
    <div className={s.empty_card_container}>
      {cards.map((card, index) => (
        <img className={s.photo} key={index} src={`./photos/${card}.png`}></img>
      ))}
    </div>
  )
}
