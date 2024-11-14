/* eslint-disable react/prop-types */
import React, { useContext } from "react"
import CardContainer from "../CardsContainer/CardContainer"
import s from "./tables.module.scss"
import { VariablesContext } from "../Context/Context"

function Tables() {
  const { users } = useContext(VariablesContext)
  console.log("tables się renderuje")

  return (
    <div className={s.tables_container}>
      {users.length > 0 ? (
        users
          .slice() // Tworzymy kopię tablicy, aby nie zmieniać oryginalnego stanu
          .sort((a, b) => a.order - b.order) // Sortowanie po polu 'order' rosnąco
          .map((user) => (
            <CardContainer
              key={user.id}
              user={user}
              userId={user.app_id}
              color={user.table}
            />
          ))
      ) : (
        <p style={{ color: "white" }}>lack of players</p>
      )}
    </div>
  )
}
export default React.memo(Tables)