import s from "./app.module.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen"
import Dashboard from "./components/Dashboard/Dashboard"
import Winner from "./components/WinnerScreen/Winner"
import { MyProvider } from "./components/Context/Context"

// Użyj zmiennej środowiskowej VITE_BASENAME (domyślnie pusty string dla środowiska lokalnego)
const basename = import.meta.env.VITE_BASENAME || ""

export default function App() {
  return (
    <Router basename={basename}>
      <div className={s.app_container}>
        <MyProvider>
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="winner" element={<Winner />} />
          </Routes>
        </MyProvider>
      </div>
    </Router>
  )
}
