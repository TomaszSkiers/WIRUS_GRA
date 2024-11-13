/* eslint-disable react/prop-types */
import { useContext } from "react"
import CardContainer from "../CardsContainer/CardContainer"
import s from "./tables.module.scss"
import { VariablesContext } from "../Context/Context"

export default function Tables({
  // users,
  setClickProtection,
  clickProtection,
  // lockYourTurn,
  setTableCard,
  // tableBlocker
}) {

  const {users} = useContext(VariablesContext)
  
  

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
              setClickProtection={setClickProtection}
              clickProtection={clickProtection}
              // lockYourTurn={lockYourTurn}
              setTableCard={setTableCard}
              // tableBlocker={tableBlocker}
            />
          ))
      ) : (
        <p style={{ color: "white" }}>lack of players</p>
      )}
    </div>
  )
}

