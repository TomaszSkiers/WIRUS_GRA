import s from "./app.module.scss"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import WelcomeScreen from "./components/WelcomeScreen/WelcomeScreen"
import Dashboard from "./components/Dashboard/Dashboard"

// import MainGameScreen from "./components/MainGameScreen/MainGameScreen"

export default function App() {
  return (
    <Router>
      {" "}
      {/**basename="/WIRUS_GRA"  to musi być przy buildowaniu */}
      <div className={s.app_container}>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  )
}
