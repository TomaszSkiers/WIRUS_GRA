/* eslint-disable react/prop-types */
import s from "./cardContainer.module.scss"

export default function CardContainer({userName}) {
  return (
    <div className={s.player_cards_wrapper}>
        <h3>{userName}</h3>
      <div className={s.photos_wrapper}>
        <img className={s.photo} src="./photos/empty_card.png"></img>
        <img className={s.photo} src="./photos/empty_card.png"></img>
        <img className={s.photo} src="./photos/empty_card.png"></img>
        <img className={s.photo} src="./photos/empty_card.png"></img>
      </div>
    </div>
  )
}
