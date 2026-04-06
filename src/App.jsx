import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelCard from './components/PixelCard'
import Quiz from './components/Quiz'
import WordGame from './components/WordGame'
import VoiceLearning from './components/VoiceLearning'
import { words, quizQuestions } from './data/words'

const tabs = [
  { id: 'cards', label: '单词卡片', icon: '📚' },
  { id: 'voice', label: '语音学习', icon: '🎤' },
  { id: 'game', label: '单词游戏', icon: '🎮' },
  { id: 'quiz', label: '测验', icon: '📝' },
]

function App() {
  const [activeTab, setActiveTab] = useState('cards')
  const [cardIndex, setCardIndex] = useState(0)

  const handleNext = () => {
    if (cardIndex < words.length - 1) {
      setCardIndex(cardIndex + 1)
    }
  }

  const handlePrev = () => {
    if (cardIndex > 0) {
      setCardIndex(cardIndex - 1)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4">
      {/* Header */}
      <motion.header
        className="text-center mb-12"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          英语学习助手
        </h1>
        <p className="text-gray-400">用有趣的方式学习英语单词</p>
      </motion.header>

      {/* Tabs */}
      <nav className="flex justify-center gap-2 mb-8">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </nav>

      {/* Content */}
      <main className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'cards' && (
              <PixelCard
                word={words[cardIndex].word}
                meaning={words[cardIndex].meaning}
                example={words[cardIndex].example}
                onNext={handleNext}
                onPrev={handlePrev}
                index={cardIndex}
                total={words.length}
              />
            )}

            {activeTab === 'voice' && <VoiceLearning />}

            {activeTab === 'game' && (
              <WordGame words={words} />
            )}

            {activeTab === 'quiz' && (
              <Quiz questions={quizQuestions} onComplete={(score) => console.log('Score:', score)} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="text-center mt-12 text-gray-500 text-sm">
        <p>用 ❤️ 制作 · reactbits 特效</p>
      </footer>
    </div>
  )
}

export default App