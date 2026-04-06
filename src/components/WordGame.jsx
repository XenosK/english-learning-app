import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WordGame({ words }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [knownWords, setKnownWords] = useState([])

  const currentWord = words[currentIndex]

  const handleKnow = () => {
    setScore(score + 1)
    setKnownWords([...knownWords, currentWord.word])
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
    setKnownWords([])
  }

  if (gameOver) {
    const percentage = Math.round((score / words.length) * 100)
    return (
      <motion.div
        className="text-center"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="w-40 h-40 mx-auto mb-6 rounded-full flex flex-col items-center justify-center" style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          border: '2px solid',
          borderColor: percentage >= 60 ? '#10b981' : '#f59e0b'
        }}>
          <span className="text-4xl font-bold text-white">{score}</span>
          <span className="text-sm" style={{ color: '#64748b' }}>/ {words.length}</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">游戏结束</h2>
        <p className="text-lg mb-4" style={{ color: '#64748b' }}>
          已掌握 <span style={{ color: '#10b981' }}>{score}</span> 个单词
        </p>

        {knownWords.length > 0 && (
          <div className="mb-6">
            <p className="text-sm mb-2" style={{ color: '#64748b' }}>已掌握的单词:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {knownWords.map(word => (
                <span key={word} className="px-3 py-1 rounded-full text-sm" style={{ background: '#10b981', color: '#fff' }}>
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}

        <motion.button
          onClick={restartGame}
          className="px-8 py-3 rounded-lg font-medium"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          再玩一次
        </motion.button>
      </motion.div>
    )
  }

  return (
    <div className="text-center">
      {/* Progress */}
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="flex justify-between text-sm mb-2" style={{ color: '#64748b' }}>
          <span>进度: {currentIndex + 1}/{words.length}</span>
          <span>得分: {score}</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#1e293b' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Word Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          className="w-full max-w-md mx-auto p-8 rounded-xl border mb-8"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderColor: '#334155' }}
        >
          <h3 className="text-4xl font-bold text-white mb-4">{currentWord.word}</h3>

          <AnimatePresence>
            {showMeaning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xl mb-2" style={{ color: '#3b82f6' }}>{currentWord.meaning}</p>
                <p className="text-sm italic" style={{ color: '#64748b' }}>"{currentWord.example}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Buttons */}
      <div className="flex gap-4 justify-center">
        {!showMeaning ? (
          <motion.button
            onClick={() => setShowMeaning(true)}
            className="px-6 py-3 rounded-lg font-medium"
            style={{ background: '#1e293b', color: '#94a3b8' }}
            whileHover={{ scale: 1.02, background: '#334155' }}
            whileTap={{ scale: 0.98 }}
          >
            显示释义
          </motion.button>
        ) : (
          <>
            <motion.button
              onClick={handleDontKnow}
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              style={{ background: '#ef4444', color: '#fff' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>✗</span> 不认识
            </motion.button>
            <motion.button
              onClick={handleKnow}
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
              style={{ background: '#10b981', color: '#fff' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>✓</span> 认识
            </motion.button>
          </>
        )}
      </div>
    </div>
  )
}