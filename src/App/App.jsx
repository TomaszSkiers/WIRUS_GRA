import s from "./app.module.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen"
import MainGameScreen from "./components/MainGameScreen/MainGameScreen"

export default function App() {
  return (
    <Router>
      <div className={s.app_container}>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="mainGameScreen" element={<MainGameScreen />} />
        </Routes>
      </div>
    </Router>
  )
}
