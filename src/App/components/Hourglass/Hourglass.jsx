import { faHourglassHalf } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import s from './hourglass.module.scss'
import React, { useContext } from "react"
import { VariablesContext } from "../Context/Context"

function Hourglass() {

  const {locYourTurn} = useContext(VariablesContext)

  if (!locYourTurn){
    return (
    <span className={s.wait}>
      <FontAwesomeIcon icon={faHourglassHalf} /> {/**ikonka klepsydry */}
    </span>
  )
  }else{
    null
  }
    
  
}
export default React.memo(Hourglass)
