/* eslint-disable react/prop-types */
import CardContainer from "../CardsContainer/CardContainer"
import s from "./tables.module.scss"

export default function Tables({ users }) {
  return (
    <div className={s.tables_container}>
      {users.length > 0 ? (
        users.map((user) => (
            <CardContainer key={user.id} userId={user.app_id } color={user.table}/>
        ))
      ):(
        <p style={{color: 'white'}}>lack of players</p>
      )}
    </div>
  )
}
