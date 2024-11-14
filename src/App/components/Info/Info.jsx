
import React, { useContext } from 'react'
import s from './info.module.scss'
import { VariablesContext } from '../Context/Context'

function Info() {

    const {info} = useContext(VariablesContext)



  return (
    <div className={s.info_container}>
      <p>{info}</p>
    </div>
  )
}
export default React.memo(Info)