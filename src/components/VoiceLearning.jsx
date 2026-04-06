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
    // Initialize speech recognition
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
      recognizer.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
      }

      setRecognition(recognizer)
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
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
      {/* Word Card */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-12 mb-8 text-center w-full max-w-md border border-indigo-700"
      >
        <p className="text-indigo-400 text-sm mb-2">{currentIndex + 1} / {sampleWords.length}</p>
        <h2 className="text-5xl font-bold text-white mb-4">{currentWord.word}</h2>
        <p className="text-xl text-indigo-300 mb-2">{currentWord.phonetic}</p>
        <p className="text-lg text-gray-400">{currentWord.meaning}</p>
      </motion.div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <motion.button
          onClick={speakWord}
          disabled={isSpeaking}
          className="px-6 py-3 bg-indigo-600 rounded-xl flex items-center gap-2 disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🔊 {isSpeaking ? '播放中...' : '播放发音'}
        </motion.button>

        <motion.button
          onClick={startListening}
          disabled={isListening}
          className={`px-6 py-3 rounded-xl flex items-center gap-2 ${
            isListening ? 'bg-red-500 animate-pulse' : 'bg-green-600'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          🎤 {isListening ? '正在录音...' : '开始朗读'}
        </motion.button>
      </div>

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-xl mb-8 ${
              result.isCorrect ? 'bg-green-500/20 border border-green-500' : 'bg-red-500/20 border border-red-500'
            }`}
          >
            <p className="text-lg mb-2">
              {result.isCorrect ? '✅ 发音正确！' : '❌ 再试一次'}
            </p>
            <p className="text-gray-400">
              你说的是: <span className="text-white">{result.transcript}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={prevWord}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          ← 上一词
        </button>
        <span className="text-gray-400">滑动切换</span>
        <button
          onClick={nextWord}
          className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          下一词 →
        </button>
      </div>

      {/* Tips */}
      <p className="text-gray-500 text-sm mt-8">
        💡 点击播放发音，然后点击朗读进行口语练习
      </p>
    </div>
  )
}