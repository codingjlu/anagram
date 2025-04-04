import { useState, useEffect, useRef } from "react"
import mess, { scramble } from "./mess"
import words from "./words"
import "./App.css"

let bank = words.filter((s) => s.length == 5)

const colors = [
  [0, 92, 0],
  [0, 0, 92],
  [92, 0, 0],
  [92, 92, 0],
  [0, 92, 92],
]

function resetClock() {
  const timeElement = document.querySelector(".time")
  timeElement.style.animation = "none"
  timeElement.offsetHeight
  timeElement.style.animation = ""
}

function App() {
  const [word, setWord] = useState(
    bank[Math.floor(Math.random() * bank.length)]
  )
  const [score, setScore] = useState(0)
  const [answerIndex, setAnswerIndex] = useState(Math.floor(Math.random() * 5))
  const [gameOver, setGameOver] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    if (score % 10 == 0 && score < 50) {
      bank = words.filter((s) => s.length == 5 + score / 10)
      document.documentElement.style.setProperty(
        "--primary-color",
        `rgba(${colors[score / 10]}, 0.5)`
      )
      document.documentElement.style.setProperty(
        "--secondary-color",
        `rgb(${colors[score / 10]})`
      )
    }
  }, [score])

  // choose new answer option
  useEffect(() => {
    setAnswerIndex(Math.floor(Math.random() * 5))
  }, [score])

  // timer
  useEffect(() => {
    if (gameOver) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setGameOver(true)
      Array.from(document.getElementsByClassName("option")).forEach((el) => {
        el.classList.add("wrong")
        el.style.setProperty(
          "--rotation",
          `${Math.floor(Math.random() * 14) - 7}deg`
        )
      })
    }, 5000)
    return () => clearTimeout(timer.current)
  }, [score])

  // game over
  useEffect(() => {
    if (gameOver) {
      clearTimeout(timer.current)
      document.querySelector(".time").style.animationPlayState = "paused"
      window.umami.track("score-" + score)
    }
  }, [gameOver])

  return (
    <>
      <div className="time"></div>
      <div className="wrapper">
        <h1 className="word">{word}</h1>
        <div className="options">
          {(() => {
            const options = mess(word)
            options.splice(answerIndex, 0, scramble(word))
            return options
          })().map((word, index) => (
            <button
              key={index}
              className="option"
              onClick={(e) => {
                if (gameOver) {
                  window.location.reload()
                  return
                }

                if (index !== answerIndex) {
                  e.target.classList.add("wrong")
                  setGameOver(true)
                  return
                }

                resetClock()
                setWord(bank[Math.floor(Math.random() * bank.length)])
                setScore(score + 1)
              }}
            >
              {gameOver ? "Try again?" : word}
            </button>
          ))}
        </div>
      </div>
      {gameOver && <div className="over"></div>}
      <div className="score">
        <h2>{score}</h2>
      </div>
    </>
  )
}

export default App
