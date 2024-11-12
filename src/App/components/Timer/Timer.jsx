import React, { useCallback, useEffect, useState } from "react"
import s from "./timer.module.scss"

function Timer() {
  const [counter, setCounter] = useState(30)

  const decrementCount = useCallback(() => setCounter((prv) => prv - 1), [])

  useEffect(() => {
    const interval = setInterval(() => {
        decrementCount()
    }, 1000)

    return () => {
        clearInterval(interval)
    }
  }, [decrementCount])

  return <h2 className={s.timer}> czas do końca tury: {counter}</h2>
}
export default React.memo(Timer)
