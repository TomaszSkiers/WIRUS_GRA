import "./App/styles/main.scss"
import App from "./App/App"
import { MyProvider } from "./App/components/Context/Context"

import ReactDOM from "react-dom/client"

// Znajdź element root
const rootElement = document.getElementById("root")

// Stwórz instancję root
const root = ReactDOM.createRoot(rootElement)

// Renderuj aplikację wewnątrz MyProvider
root.render(
  <MyProvider>
    <App />
  </MyProvider>
)
