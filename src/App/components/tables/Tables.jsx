/* eslint-disable react/prop-types */
import React, { useContext } from "react"
import CardContainer from "../CardsContainer/CardContainer"
import s from "./tables.module.scss"
import { VariablesContext } from "../Context/Context"
import EmptyCardContainer from "../EmptyCardContainer/EmptyCardContainer"

function Tables() {
  const { users, appId } = useContext(VariablesContext)

  //muszę wyciągnąć userów z obcym appId
  const filteredUsers = users.filter(user => user.app_id !== appId)

  // console.log("tables się renderuje")

  return (
    <div className={s.tables_container}>
      {filteredUsers[0] ? (
        <CardContainer
          key={filteredUsers[0].id}
          user={filteredUsers[0]}
          userId={filteredUsers[0].app_id}
          color={filteredUsers[0].table}
        />
      ) : (
        <EmptyCardContainer />
      )}
      {filteredUsers[1] ? (
        <CardContainer
          key={filteredUsers[1].id}
          user={filteredUsers[1]}
          userId={filteredUsers[1].app_id}
          color={filteredUsers[1].table}
        />
      ) : (
        <EmptyCardContainer />
      )}
      {filteredUsers[2] ? (
        <CardContainer
          key={filteredUsers[2].id}
          user={filteredUsers[2]}
          userId={filteredUsers[2].app_id}
          color={filteredUsers[2].table}
        />
      ) : (
        <EmptyCardContainer />
      )}
    </div>
  )
}
export default React.memo(Tables)
{
  /* <CardContainer key={users[0].key} user={users[0]} userId={users[0].app_id } color={users[0].color}/> */
}

{
  /* {users.length > 0 ? (
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
      )} */
}
