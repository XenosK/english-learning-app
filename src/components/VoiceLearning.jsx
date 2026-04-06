import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const sampleWords = [
  { word: "Hello", phonetic: "/həˈloʊ/", meaning: "你好" },
  { word: "World", phonetic: "/wɜːrld/", meaning: "世界" },
  { word: "Learn", phonetic: "/lɜːrn/", meaning: "学习" },
  { word: "Speak", phonetic: "/spiːk/", meaning: "说话" },
  { word: "English", phonetic: "/ˈɪŋɡlɪʃ/", meaning: "英语" },
  { word: "Practice", phonetic: "/ˈpræktɪs/", meaning: "练习" },
  { word: " pronunciation", phonetic: "/prəˌnʌnsiˈeɪʃn/", meaning: "发音" },
  { word: "Vocabulary", phonetic: "/voˈkæbjəleri/", meaning: "词汇" },
  { word: "Conversation", phonetic: "/ˌkɒnvərˈseɪʃn/", meaning: "对话" },
  { word: "Fluently", phonetic: "/ˈfluːəntli/", meaning: "流利地" },
]

export default function VoiceLearning() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [result, setResult] = useState(null)
  const [recognition, setRecognition] = useState(null)

  const currentWord = sampleWords[currentIndex]

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognizer = new SpeechRecognition()
      recognizer.continuous = false
      recognizer.interimResults = false
      recognizer.lang = 'en-US'

      recognizer.onstart = () => setIsListening(true)
      recognizer.onend = () => setIsListening(false)
      recognizer.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase()
        const isCorrect = transcript === currentWord.word.toLowerCase()
        setResult({ transcript, isCorrect })
      }
      recognizer.onerror = () => setIsListening(false)

      setRecognition(recognizer)
    }

    return () => {
      if (recognition) recognizer.abort()
    }
  }, [currentWord.word])

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
    }
  }

  const speakWord = () => speak(currentWord.word)
  const startListening = () => {
    if (recognition) {
      setResult(null)
      recognition.start()
    }
  }
  const nextWord = () => {
    setCurrentIndex((currentIndex + 1) % sampleWords.length)
    setResult(null)
  }
  const prevWord = () => {
    setCurrentIndex((currentIndex - 1 + sampleWords.length) % sampleWords.length)
    setResult(null)
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between text-sm mb-2" style={{ color: '#64748b' }}>
          <span>词汇量: {currentIndex + 1}/10</span>
          <span>进度 {((currentIndex + 1) / 10) * 100}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: '#1e293b' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Word Card */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md p-8 rounded-xl border mb-6"
        style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderColor: '#334155' }}
      >
        <h2 className="text-4xl font-bold text-white text-center mb-3">{currentWord.word}</h2>
        <p className="text-center text-lg mb-2" style={{ color: '#3b82f6' }}>{currentWord.phonetic}</p>
        <p className="text-center" style={{ color: '#64748b' }}>{currentWord.meaning}</p>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-4 mb-6">
        <motion.button
          onClick={speakWord}
          disabled={isSpeaking}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
          style={{ background: '#1e293b', color: '#f8fafc' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🔊</span>
          {isSpeaking ? '播放中' : '播放发音'}
        </motion.button>

        <motion.button
          onClick={startListening}
          disabled={isListening}
          className="px-6 py-3 rounded-lg font-medium flex items-center gap-2"
          style={{
            background: isListening ? '#ef4444' : '#3b82f6',
            color: '#fff'
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>🎤</span>
          {isListening ? '正在录音' : '开始朗读'}
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md p-4 rounded-lg mb-6"
            style={{
              background: result.isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${result.isCorrect ? '#10b981' : '#ef4444'}`
            }}
          >
            <p className="text-center font-medium" style={{ color: result.isCorrect ? '#10b981' : '#ef4444' }}>
              {result.isCorrect ? '✓ 发音正确' : '✗ 再试一次'}
            </p>
            <p className="text-center text-sm mt-1" style={{ color: '#64748b' }}>
              你说的是: <span style={{ color: '#f8fafc' }}>{result.transcript}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button onClick={prevWord} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#1e293b', color: '#94a3b8' }}>
          ← 上一词
        </button>
        <button onClick={nextWord} className="px-4 py-2 rounded-lg text-sm" style={{ background: '#1e293b', color: '#94a3b8' }}>
          下一词 →
        </button>
      </div>
    </div>
  )
}