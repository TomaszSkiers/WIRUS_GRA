/* eslint-disable react/prop-types */
import { createContext, useState } from "react"

// Tworzymy kontekst
const MyContext = createContext()

// Tworzymy komponent dostarczający (Provider) kontekst
export const MyProvider = ({ children }) => {
  const [global, setGlobal] = useState("Domyślna wartość")

  return (
    <MyContext.Provider value={{ global, setGlobal }}>
      {children}
    </MyContext.Provider>
  )
}
