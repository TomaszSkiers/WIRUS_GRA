/* eslint-disable react/prop-types */
import { createContext, useCallback, useMemo, useState, useEffect } from "react"
import { generateSimpleID } from "../../functions/simpleID"
import { handleEndOfGames } from "../../functions/handleEndOfGame"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

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

  //przenoszę obsługę users z dashboard do kontextu
  useEffect(() => {
    // sortowanie po czasie
    const usersSortedByTime = [...users].sort(
      (a, b) => new Date(a.time) - new Date(b.time)
    )
    //* wyświetlam do testów
    // console.log(usersSortedByTime)
    // console.log(users, 'wyświetlam stan users po aktualizacji')

    //np: jeżeli id jest równe mojemu to odblokowuję ekran i mója kolej

    if (usersSortedByTime[0]?.app_id === appId) {
      setLocYourTurn(true)
    } else {
      setLocYourTurn(false)
    }

    //* tu mogę wywołać metodę do sprawdzania wygranej i chyba nie zaleznie od usera
    //* mogę zawsze sprawdzić wszystkich; w     Cards handlePhotoClilk aktualizuje tableCards a tableCard aktualizuje users
    //* czyli tu powinno zadziałać
    //* tylko najlepiej żeby sprawdzało wszystkich graczy
    //* jeżeli zwróci mi ID wygranego gracza to jakaś reakcja musi być, tylko jaka?, może komponent kończący z
    //* brawo wygrana teg i tego i przycisk, czy nowa gra?

    const winner = handleEndOfGames(users)
    // console.log("winner", winner)
    // const winner = false
    if (winner) {
      // pobieram gracza który wygrał do wysyłki reszcie
      const userObject = users.find((user) => user.id === winner)

      //wyszukuję siebie
      const myId = users.find((user) => user.app_id === appId)
      navigate("/winner", {
        state: { userObject, myId: myId?.id }
      })
    }

    if (users.length === 1) {
      handleSetInfo("jesteś jedynym graczem poczekaj na pozostałych")
    }
  }, [users])

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
