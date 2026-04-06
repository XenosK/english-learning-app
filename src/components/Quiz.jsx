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

    if (correct) setScore(score + 1)
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
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center" style={{
          background: percentage >= 60 ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #f59e0b, #d97706)'
        }}>
          <span className="text-4xl font-bold text-white">{percentage}%</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">测验完成</h2>
        <p className="text-lg mb-4" style={{ color: '#64748b' }}>
          你的得分: <span style={{ color: '#3b82f6' }}>{score}</span> / {questions.length}
        </p>
        <p style={{ color: '#94a3b8' }}>
          {percentage >= 80 ? '优秀！继续加油！' : percentage >= 60 ? '良好！还有进步空间' : '需要多加练习'}
        </p>
      </motion.div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2" style={{ color: '#64748b' }}>
          <span>问题 {current + 1}/{questions.length}</span>
          <span>得分: {score}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#1e293b' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
        >
          <h3 className="text-xl font-medium text-white mb-6">{questions[current].question}</h3>

          <div className="space-y-3">
            {questions[current].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={selected !== null}
                className="w-full p-4 rounded-lg text-left font-medium transition-all"
                style={{
                  background: selected === index
                    ? (isCorrect ? '#10b981' : '#ef4444')
                    : (selected !== null && index === questions[current].correct ? '#10b981' : '#1e293b'),
                  border: '1px solid',
                  borderColor: selected === index
                    ? (isCorrect ? '#10b981' : '#ef4444')
                    : (selected !== null && index === questions[current].correct ? '#10b981' : '#334155'),
                  color: '#f8fafc'
                }}
                whileHover={selected === null ? { scale: 1.01, borderColor: '#3b82f6' } : {}}
                whileTap={selected === null ? { scale: 0.99 } : {}}
              >
                <span className="inline-block w-6 h-6 rounded-full text-sm mr-3 text-center" style={{
                  background: selected === index || (selected !== null && index === questions[current].correct)
                    ? 'rgba(255,255,255,0.2)' : '#334155'
                }}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}