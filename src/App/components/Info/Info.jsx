
import { useContext } from 'react'
import s from './info.module.scss'
import { VariablesContext } from '../Context/Context'

export default function Info() {

    const {info} = useContext(VariablesContext)



  return (
    <div className={s.info_container}>
      <p>{info}</p>
    </div>
  )
}
