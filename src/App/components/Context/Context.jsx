/* eslint-disable react/prop-types */
import { createContext, useCallback, useMemo, useState } from "react"
import { generateSimpleID } from "../../functions/simpleID"

// Tworzymy kontekst
export const VariablesContext = createContext()
export const FunctionsContext = createContext()

// Tworzymy komponent dostarczający (Provider) kontekst
export const MyProvider = ({ children }) => {
  const [appId] = useState(generateSimpleID)
  const [info, setInfo] = useState("info z kontekstu")
  const [moreThanOneCardChecked, setMoreThanOneCardCheckedCopy] = useState(false)
  const [locYourTurn, setLocYourTurnCopy] = useState(false) //blokuje możliwość gry
  const [timer, setTimer] = useState("ustawienia timera")
  const [users, setUsersCopy] = useState([])
  const [tableBlocker, setTableBlockerCopy] = useState(false)
  const [tableCard, setTableCardCopy] = useState(false)
  const [handCard, setHandCardCopy] = useState(false) //karta wybrana z ręki
  const [handBlocker, setHandBlockerCopy] = useState(false)
  const [handWithCards, setHandWithCardsCopy] = useState([
    "empty-card",
    "empty-card",
    "empty-card"
  ])
  const [clickProtection, setClickProtectionCopy] = useState(false)
  const [myTableColor, setMyTableColorCopy] = useState(false)

  const setMyTableColor = useCallback((setting)=> {
    setMyTableColorCopy(setting)
  },[])

  const setClickProtection = useCallback((setting) => {
    setClickProtectionCopy(setting)
  }, [])

  const setMoreThanOneCardChecked = useCallback((setting)=> {
    setMoreThanOneCardCheckedCopy(setting)
  },[])

  const setTableBlocker = useCallback((setting) => {
    setTableBlockerCopy(setting)
  }, [])

  const setLocYourTurn = useCallback((setting) => {
    setLocYourTurnCopy(setting)
  }, [])

  const handleSetInfo = useCallback((info) => {
    setInfo(info)
  }, [])

  const handleSetTimer = useCallback((settings) => {
    setTimer(settings)
  }, [])

  const setUsers = useCallback((users) => {
    setUsersCopy(users)
  }, [])

  const setTableCard = useCallback((table) => {
    setTableCardCopy(table)
  }, [])

  //zrobiłem taką samą nazwę co w dashboard i teraz zrobię sobie destrukturyzację i wyłączę
  //zmienną z dashboard i muszę jeszcze podpiąć ją pod hand i timer
  const setHandCard = useCallback((table) => {
    setHandCardCopy(table)
  }, [])

  const setHandBlocker = useCallback((setting) => {
    setHandBlockerCopy(setting)
  }, [])

  const setHandWithCards = useCallback((params) => {
    setHandWithCardsCopy(params)
  }, [])

  const functions = useMemo(
    () => ({
      handleSetInfo,
      handleSetTimer,
      setUsers,
      setTableCard,
      setHandCard,
      setHandBlocker,
      setHandWithCards,
      setLocYourTurn,
      setTableBlocker,
      setMoreThanOneCardChecked,
      setClickProtection,
      setMyTableColor,
    }),
    [
      handleSetInfo,
      handleSetTimer,
      setUsers,
      setTableCard,
      setHandCard,
      setHandBlocker,
      setHandWithCards,
      setLocYourTurn,
      setTableBlocker,
      setMoreThanOneCardChecked,
      setClickProtection,
      setMyTableColor,
    ]
  )

  return (
    <VariablesContext.Provider
      value={{
        appId,
        info,
        timer,
        users,
        tableCard,
        handCard,
        handBlocker,
        handWithCards,
        locYourTurn,
        tableBlocker,
        moreThanOneCardChecked,
        clickProtection,
        myTableColor,
      }}
    >
      <FunctionsContext.Provider value={functions}>
        {children}
      </FunctionsContext.Provider>
    </VariablesContext.Provider>
  )
}
