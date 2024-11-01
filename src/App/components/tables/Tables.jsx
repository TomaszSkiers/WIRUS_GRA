/* eslint-disable react/prop-types */
import CardContainer from "../CardsContainer/CardContainer"
import s from "./tables.module.scss"

export default function Tables({ users, setClickProtection, clickProtection }) {
  return (
    <div className={s.tables_container}>
      {users.length > 0 ? (
        users.map((user) => (
          <CardContainer
            key={user.id}
            user={user}
            userId={user.app_id}
            color={user.table}
            setClickProtection={setClickProtection}
            clickProtection={clickProtection}
          />
        ))
      ) : (
        <p style={{ color: "white" }}>lack of players</p>
      )}
    </div>
  )
}
