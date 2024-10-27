import s from "./app.module.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen"
import MainGameScreen from "./components/MainGameScreen/MainGameScreen"

export default function App() {
  return (
    <Router  basename="/WIRUS_GRA"> {/**basename="/WIRUS_GRA"  to musi być przy buildowaniu */}
      <div className={s.app_container}>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="mainGameScreen" element={<MainGameScreen />} />
        </Routes>
      </div>
    </Router>
  )
}
