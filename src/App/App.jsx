import s from "./app.module.scss"

export default function App() {
  return (
    <div className={s.container}>
      <h1>Virus</h1>
      
      <form>
        <input type="text" placeholder="enter your name"></input>
        <button type="submit">START</button>
      </form>
    </div>
  )
}