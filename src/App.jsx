import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PixelCard from './components/PixelCard'
import Quiz from './components/Quiz'
import WordGame from './components/WordGame'
import VoiceLearning from './components/VoiceLearning'
import { words, quizQuestions } from './data/words'

const tabs = [
  { id: 'cards', label: '词汇学习', icon: '📖' },
  { id: 'voice', label: '口语训练', icon: '🎤' },
  { id: 'game', label: '记忆游戏', icon: '🎯' },
  { id: 'quiz', label: '能力测验', icon: '✓' },
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
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0f1c 0%, #0f172a 50%, #0f172a 100%)' }}>
      {/* Header */}
      <header className="border-b" style={{ borderColor: '#1e293b', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <span className="text-white font-bold text-lg">E</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">English Pro</h1>
              <p className="text-xs" style={{ color: '#64748b' }}>企业级英语学习平台</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: '#64748b' }}>学习进度: 35%</span>
            <div className="w-32 h-2 rounded-full" style={{ background: '#1e293b' }}>
              <div className="h-full w-[35%] rounded-full" style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}></div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: '#1e293b' }}>
              <span className="text-sm text-white">U</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b" style={{ borderColor: '#1e293b', background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-5 py-4 text-sm font-medium transition-all relative"
                style={{
                  color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                  background: 'transparent',
                }}
                whileHover={{ color: '#94a3b8' }}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
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
      <footer className="border-t py-4 text-center" style={{ borderColor: '#1e293b', background: 'rgba(15, 23, 42, 0.8)' }}>
        <p className="text-xs" style={{ color: '#475569' }}>© 2024 English Pro. 企业级英语学习平台</p>
      </footer>
    </div>
  )
}

export default App