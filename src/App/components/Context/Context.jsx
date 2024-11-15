/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useCallback, useMemo, useState, useEffect } from "react"
import { generateSimpleID } from "../../functions/simpleID"
import { handleEndOfGames } from "../../functions/handleEndOfGame"
import { useNavigate } from "react-router-dom"
import { checkCards } from "../../functions/checkCard"
import supabase from "../../supabase/supabase"

// Tworzymy kontekst
export const VariablesContext = createContext()
export const FunctionsContext = createContext()

// Tworzymy komponent dostarczający (Provider) kontekst
export const MyProvider = ({ children }) => {
  const [appId] = useState(generateSimpleID)
  const [info, setInfo] = useState("info z kontekstu")
  const [moreThanOneCardChecked, setMoreThanOneCardCheckedCopy] =
    useState(false)
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
  const [locId, setLocId] = useState(false) //blokuje ponowne zapisywanie Id do localStorage
  const [locFetAcUsers, setlocFetAcUsers] = useState(false) //blokuje ponowne pobieranie całej tabeli
  const [switchButtons, setSwitchButtonsCopy] = useState(false)

  const navigate = useNavigate()

  const setSwitchButtons = useCallback((setting)=> {
    setSwitchButtonsCopy(setting)
  },[])

  const setMyTableColor = useCallback((setting) => {
    setMyTableColorCopy(setting)
  }, [])

  const setClickProtection = useCallback((setting) => {
    setClickProtectionCopy(setting)
  }, [])

  const setMoreThanOneCardChecked = useCallback((setting) => {
    setMoreThanOneCardCheckedCopy(setting)
  }, [])

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
      setSwitchButtons
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
      setSwitchButtons
    ]
  )

  //*przenoszę obsługę users z dashboard do useContext
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

  //*przenoszę obsługę tableCard z dashboard do useContext
  useEffect(() => {
    //todo << ------------------------------------------------- start useEffect [tableCard]

    const updateCards = async () => {
      //sprawdzam ile zaznaczono kart
      if (moreThanOneCardChecked) {
        //* tu mam renderowanie aktualizacja spowoduje renderowanie wszystkiego jeszcze raz
        handleSetInfo(
          "zaznaczyłeś więcej niż jedną kartę i tu trzeba dokończyć tekst"
        )
        return
      }

      //sprawdzam czy wybrano organ ,który ma być położony
      if (!handCard) {
        handleSetInfo("wybierz najpierw organ, który chcesz położyć")

        // można dodać jakiś dźwięk niepowodzenia
        return
      }

      // tutaj będzie moja funkcja await do sprawdzanaia
      // i rezultat do wstawienia do stanu
      // result [card, info]
      const result = await checkCards(users, handCard, tableCard)

      if (handCard !== false && tableCard !== false) {
        //* uruchom wstawianie do bazy danych , nie tutaj tylko w handleEndTurn
        //* a tutaj wizualizację dla użytkownika, czyli aktualizacja stanu
        // ? { ...user, [`k${tableCard[1] + 1}`]: handCard[1] } // to było poprzednio i działało
        setUsers((prv) =>
          prv.map((user) =>
            user.id === tableCard[0] //jak znajdziesz moj stan kart to
              ? { ...user, [`k${tableCard[1] + 1}`]: result[0] } // z pod pole k1 lub k2 lub k3 wstaw wartość z handCard
              : user
          )
        )

        const index = handCard[0] //pobieram index klikniętej karty
        //zmieniam kartę w ręku na pustą dla wizualizacji
        setHandWithCards((prv) => {
          const copy = [...prv]
          copy[index - 1] = "empty-card"
          return copy
        })

        //blokuję możliwość klikania w karty
        setTableBlocker(true)
        setHandBlocker(true)
        // setInfo((prv) => ({ ...prv, action: result[1] }))
      }
    }
    updateCards()
  }, [tableCard]) // todo << ------------------------------------------------- end

  useEffect(() => {
    const fetchActiveUsers = async () => {
      //f. do pobierania wszystkich użytkowników cały stan gry tylko na początku jeden raz
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .not("app_id", "is", null)

      if (error) {
        console.error("Błąd podczas pobierania aktywnych użytkowników:", error)
      } else {
        //* to mogę sprawdzić, który gracz się nie wylogował, jeżeli log będzie starszy niż 30s tzn. że nie gra
        setUsers(data) //zapisz stan gry do stanu
      }
    }

    // Inicjalizacja subskrypcji
    const subscription = supabase
      .channel("public:users")
      .on(
        "postgres_changes",
        { event: "update", schema: "public", table: "users" },
        async (payload) => {
          console.log("ładunek z bazy danych", payload.new)
          setTableBlocker(false) //wyłączam blokowanie kliknięć na stoliku

          if (payload.new.app_id === appId) {
            //zakładan filtr tylko na moje wiadomości

            //todo ---------- counter
            //*jak przyleci moje id to znaczy że jest tylko jeden gracz to trzeba wyłączyć

            //todo ------------end counter

            if (!locId) {
              // to muszę zapisać tylko raz później zablokować
              localStorage.setItem("userData", payload.new.id)
              setMyTableColor(payload.new.table)
              setLocId(true)
            }
            if (!locFetAcUsers) {
              //* tu mogę sprawdzić czy users.lenght === 1
              // jak dołączam do gry pobieram wszystkich userów później będę na bieżąco aktualizował stan
              await fetchActiveUsers()
              setlocFetAcUsers(true) //wyłączm ponowne pobieranie wszystkich graczy muszę to zrobić tylko na początku później oszczędzam zapytania do bazy danych
            } else {
              //* to dopiero sie wykona po wciśnięciu dołącz do gry jak zostaną pobrani wszyscy gracze (wszyscy gracze są pobierani tylko raz na początku)
              setUsers(
                (
                  prv // jak wlecą wiadomości odemnie to mój stan też trzeba zaktualizować
                ) =>
                  prv.map(
                    (
                      user //jak znajdzisz w stanie obiekt z moim ID to go zaktualizuj
                    ) =>
                      user.id === payload.new.id
                        ? { ...user, ...payload.new }
                        : user
                  )
              )
            }
          } else {
            //todo ------------------------------------------------------------------------------------------------------------  timer
            //informacja o nowych kartach
            handleSetInfo(`gracz ${payload.new.table} zakończył turę`)
            //todo -------------- counter
            //* jak przyleci obce id to przedłużam czas
            // odblokowuję rękę

            //todo ----------------- end counter
            // tutaj filtrowanie obcych id
            // jak wleci obce id aktualizuję sobie stan gry/ userów
            // tu wleci mój aktualy stan z kartami i czasem ja jestem najpóźniej w stanie gry więc aktywny jest teraz najwcześniejszy user
            setUsers((prv) => {
              // aktualizacja stanu users (stanu gry)
              const index = prv.findIndex((user) => user.id === payload.new.id)

              // Sprawdzamy, czy app_id jest null
              if (payload.new.app_id === null) {
                // Usuwamy użytkownika ze stanu, jeśli app_id jest null
                return prv.filter((user) => user.id !== payload.new.id)
              }

              if (index !== -1) {
                //jeżeli przyleciał user, który już istnieje w stanie, to go aktualizuję
                const updatedUsers = [...prv]
                updatedUsers[index] = { ...updatedUsers[index], ...payload.new }
                return updatedUsers
              } else {
                //jeżeli przyleciał user, którego nie ma w stanie to go dodaję
                return [...prv, payload.new]
              }
            })
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

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
        switchButtons
      }}
    >
      <FunctionsContext.Provider value={functions}>
        {children}
      </FunctionsContext.Provider>
    </VariablesContext.Provider>
  )
}
