import { useState } from "react";
import "./style.css";

const fortunes = [
  "Сегодня удача улыбнётся тебе.",
  "Кто-то скоро напишет первым.",
  "Не откладывай хорошую идею.",
  "Сегодня отличный день для нового начала.",
  "Не бойся сделать первый шаг.",
  "Твой лучший момент ещё впереди."
];

export default function App() {
  const [opened, setOpened] = useState(false);
  const [fortune, setFortune] = useState("");

  function openCookie() {
    if (opened) return;
    setOpened(true);
    setFortune(fortunes[Math.floor(Math.random() * fortunes.length)]);
  }

  return (
    <div className="app">
      <div className={`cookie ${opened ? "open" : ""}`} onClick={openCookie}>
        <div className="left"></div>
        <div className="right"></div>
      </div>

      <h1>Fortune Cookie</h1>

      {!opened ? (
        <button onClick={openCookie}>Открыть печенье</button>
      ) : (
        <div className="paper">
          <p>{fortune}</p>
          <button onClick={() => setOpened(false)}>Закрыть</button>
        </div>
      )}
    </div>
  );
}
