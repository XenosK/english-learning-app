import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Quiz({ questions, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)

  const handleAnswer = (index) => {
    if (selected !== null) return

    setSelected(index)
    const correct = index === questions[current].correct

    if (correct) {
      setScore(score + 1)
    }
    setIsCorrect(correct)

    setTimeout(() => {
      if (current < questions.length - 1) {
        setCurrent(current + 1)
        setSelected(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
        onComplete(score + (correct ? 1 : 0))
      }
    }, 1500)
  }

  if (showResult) {
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">测验完成！</h2>
        <p className="text-xl mb-4">
          你的得分: <span className="text-indigo-400 font-bold">{score}</span> / {questions.length}
        </p>
        <div className="text-6xl mb-4">
          {score >= 4 ? '🎉' : score >= 2 ? '👍' : '💪'}
        </div>
        <p className="text-gray-400">
          {score >= 4 ? '太棒了！' : score >= 2 ? '还不错，继续努力！' : '再接再厉！'}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <span className="text-gray-400">问题 {current + 1} / {questions.length}</span>
        <span className="text-indigo-400">得分: {score}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-6">{questions[current].question}</h3>

          <div className="space-y-3">
            {questions[current].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selected !== null}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selected === index
                    ? isCorrect
                      ? 'bg-green-500 border-2 border-green-400'
                      : 'bg-red-500 border-2 border-red-400'
                    : selected !== null && index === questions[current].correct
                    ? 'bg-green-500 border-2 border-green-400'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-indigo-500 hover:bg-gray-700'
                }`}
                whileHover={selected === null ? { scale: 1.02 } : {}}
                whileTap={selected === null ? { scale: 0.98 } : {}}
              >
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}