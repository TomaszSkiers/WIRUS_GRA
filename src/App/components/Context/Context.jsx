/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

// Tworzymy kontekst
const MyContext = createContext()

// Tworzymy komponent dostarczający (Provider) kontekst
export const MyProvider = ({ children }) => {
  const [tableBlocker, setTableBlocker] = useState(false)
  const blockTable = (arg) => {
    setTableBlocker(arg)
  }

  return (
    <MyContext.Provider value={{ tableBlocker, blockTable }}>
      {children}
    </MyContext.Provider>
  )
}
