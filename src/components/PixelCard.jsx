import { useState } from 'react'
import { motion } from 'framer-motion'

export default function PixelCard({ word, meaning, example, onNext, onPrev, index, total }) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [particles, setParticles] = useState([])

  const handleHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newParticles = []
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color: ['#6366f1', '#ec4899', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
      })
    }
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 500)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        className="relative w-80 h-96 cursor-pointer perspective-1000"
        onHoverStart={handleHover}
        onClick={() => setIsFlipped(!isFlipped)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: p.x,
              top: p.y,
              backgroundColor: p.color,
              boxShadow: `0 0 10px ${p.color}`
            }}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: (Math.random() - 0.5) * 100,
              y: (Math.random() - 0.5) * 100
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        ))}

        <motion.div
          className="w-full h-full relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
        >
          {/* Front */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 flex flex-col items-center justify-center border border-gray-700"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="grid grid-cols-8 gap-1 mb-6">
              {Array(64).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-sm"
                  style={{
                    backgroundColor: `hsl(${(i * 20 + index * 30) % 360}, 70%, 60%)`,
                    opacity: Math.random() > 0.3 ? 1 : 0.2
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            <h2 className="text-4xl font-bold text-white mb-2">{word}</h2>
            <p className="text-gray-400 text-sm">点击查看释义</p>
          </div>

          {/* Back */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 flex flex-col items-center justify-center border border-indigo-500"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)'
            }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">{meaning}</h3>
            <p className="text-indigo-200 text-center text-sm italic">"{example}"</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-600 transition"
        >
          ← 上一张
        </button>
        <span className="text-gray-400">{index + 1} / {total}</span>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-30 hover:bg-gray-600 transition"
        >
          下一张 →
        </button>
      </div>
    </div>
  )
}