import React, { useContext } from "react"
import s from "./tableColorInfo.module.scss"
import Timer from "../Timer/Timer"
import { VariablesContext } from "../Context/Context"

function TableColorInfo() {
  const { myTableColor } = useContext(VariablesContext)

  return (
    <div className={s.table_color_info}>
      <h3 style={{ color: myTableColor }}>
        twój stolik ma kolor {myTableColor}
      </h3>
      <Timer />
    </div>
  )
}
export default React.memo(TableColorInfo)
