import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WordGame({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const currentWord = words[currentIndex]

  const handleKnow = () => {
    setScore(score + 1)
    nextWord()
  }

  const handleDontKnow = () => {
    nextWord()
  }

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowMeaning(false)
    } else {
      setGameOver(true)
    }
  }

  const restartGame = () => {
    setCurrentIndex(0)
    setScore(0)
    setShowMeaning(false)
    setGameOver(false)
  }

  if (gameOver) {
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-3xl font-bold mb-4">游戏结束！</h2>
        <p className="text-xl mb-2">你掌握了 <span className="text-green-400 font-bold">{score}</span> 个单词</p>
        <p className="text-gray-400 mb-6">共 {words.length} 个单词</p>
        <div className="text-6xl mb-6">
          {score >= 8 ? '🏆' : score >= 5 ? '⭐' : '💪'}
        </div>
        <button
          onClick={restartGame}
          className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition"
        >
          再玩一次
        </button>
      </motion.div>
    )
  }

  return (
    <div className="text-center">
      <div className="mb-6">
        <span className="text-gray-400">进度: {currentIndex + 1} / {words.length}</span>
        <div className="w-64 h-2 bg-gray-700 rounded-full mt-2 mx-auto overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="bg-gray-800 rounded-2xl p-8 mb-6 max-w-md mx-auto"
        >
          <h3 className="text-4xl font-bold mb-4">{currentWord.word}</h3>

          <AnimatePresence>
            {showMeaning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xl text-indigo-400 mb-2">{currentWord.meaning}</p>
                <p className="text-gray-400 italic">"{currentWord.example}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-4 justify-center">
        {!showMeaning ? (
          <button
            onClick={() => setShowMeaning(true)}
            className="px-6 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 transition"
          >
            显示释义
          </button>
        ) : (
          <>
            <button
              onClick={handleDontKnow}
              className="px-6 py-3 bg-red-600 rounded-xl hover:bg-red-500 transition"
            >
              不认识 😢
            </button>
            <button
              onClick={handleKnow}
              className="px-6 py-3 bg-green-600 rounded-xl hover:bg-green-500 transition"
            >
              认识 ✅
            </button>
          </>
        )}
      </div>

      <div className="mt-6 text-gray-400">
        得分: <span className="text-white font-bold">{score}</span>
      </div>
    </div>
  )
}