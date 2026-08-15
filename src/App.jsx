
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./style.css";

const cookies = [
  {
    type: "Обычное",
    emoji: "🍪",
    chance: 80,
    className: "common",
    fortunes: [
      "Сегодня удача улыбнётся тебе.",
      "Кто-то скоро напишет первым.",
      "Не откладывай хорошую идею."
    ]
  },
  {
    type: "Счастливое",
    emoji: "✨",
    chance: 15,
    className: "lucky",
    fortunes: [
      "Сегодня тебя ждёт приятный сюрприз.",
      "Случайность сыграет на твоей стороне."
    ]
  },
  {
    type: "Золотое",
    emoji: "🌟",
    chance: 4,
    className: "gold",
    fortunes: [
      "Редкий шанс уже рядом — не пропусти его."
    ]
  },
  {
    type: "Легендарное",
    emoji: "💜",
    chance: 1,
    className: "legend",
    fortunes: [
      "Одна смелая идея изменит твою неделю."
    ]
  }
];

function randomCookie() {
  const r = Math.random() * 100;
  let sum = 0;

  for (const c of cookies) {
    sum += c.chance;
    if (r < sum) return c;
  }

  return cookies[0];
}

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [cookieData, setCookieData] = useState(null);
  const [streak, setStreak] = useState(0);
  const [canOpen, setCanOpen] = useState(true);

  useEffect(() => {
    const lastOpen = localStorage.getItem("lastOpenDate");
    const savedStreak = Number(localStorage.getItem("streak") || 0);

    setStreak(savedStreak);

    if (lastOpen === todayString()) {
      setCanOpen(false);
    }
  }, []);

  function openCookie() {
    if (!canOpen) return;

    const cookie = randomCookie();

    setCookieData({
      ...cookie,
      fortune:
        cookie.fortunes[
          Math.floor(Math.random() * cookie.fortunes.length)
        ]
    });

    setOpened(true);
    setCanOpen(false);

    const today = todayString();
    const lastOpen = localStorage.getItem("lastOpenDate");

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const yesterdayString = yesterday.toISOString().slice(0, 10);

    let newStreak;

    if (lastOpen === yesterdayString) {
      newStreak = streak + 1;
    } else if (lastOpen === today) {
      newStreak = streak;
    } else {
      newStreak = 1;
    }

    setStreak(newStreak);

    localStorage.setItem("streak", newStreak);
    localStorage.setItem("lastOpenDate", today);
  }

  return (
    <div className={`app ${cookieData?.className || ""}`}>

      <div style={{fontWeight:"bold",color:"#7a4a12"}}>
        🔥 Серия: {streak} дней
      </div>

      <motion.div
        className="cookie"
        onClick={openCookie}
        animate={!opened ? { y: [0, -10, 0] } : { y: 0 }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <motion.div
          className="cookie-left"
          animate={opened ? { x: -45, rotate: -28 } : { x: 0, rotate: 0 }}
        />

        <motion.div
          className="cookie-right"
          animate={opened ? { x: 45, rotate: 28 } : { x: 0, rotate: 0 }}
        />

        <motion.div
          className="cookie-glow"
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      <motion.h1>Magic Cookie</motion.h1>

      {!opened && canOpen && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={openCookie}
        >
          ✨ Открыть печенье
        </motion.button>
      )}

      {!opened && !canOpen && (
        <div
          style={{
            background:"#fff",
            padding:"18px",
            borderRadius:"18px",
            textAlign:"center",
            boxShadow:"0 10px 25px rgba(0,0,0,.12)"
          }}
        >
          <h3>🍪 Сегодня печенье уже открыто</h3>
          <p>Возвращайся завтра за новым предсказанием.</p>
        </div>
      )}

      <AnimatePresence>
        {opened && cookieData && (
          <motion.div
            className={`paper ${cookieData.className}`}
            initial={{ opacity: 0, y: 120, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 120 }}
            transition={{ type: "spring", stiffness: 120 }}
          >
            <div className="paper-title">
              {cookieData.emoji} {cookieData.type}
            </div>

            <p>{cookieData.fortune}</p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setOpened(false);
                setCookieData(null);
              }}
            >
              Закрыть
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}