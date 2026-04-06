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
    for (let i = 0; i < 6; i++) {
      newParticles.push({
        id: Date.now() + i,
        x,
        y,
        color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][Math.floor(Math.random() * 4)]
      })
    }
    setParticles(newParticles)
    setTimeout(() => setParticles([]), 500)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      <motion.div
        className="relative w-80 cursor-pointer"
        style={{ perspective: '1000px' }}
        onHoverStart={handleHover}
        onClick={() => setIsFlipped(!isFlipped)}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
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
              boxShadow: `0 0 8px ${p.color}`
            }}
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{
              opacity: 0,
              scale: 0,
              x: (Math.random() - 0.5) * 80,
              y: (Math.random() - 0.5) * 80
            }}
            transition={{ duration: 0.5 }}
          />
        ))}

        <motion.div
          className="relative"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Front */}
          <div
            className="p-8 rounded-xl border"
            style={{
              backfaceVisibility: 'hidden',
              background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
              borderColor: '#334155'
            }}
          >
            <div className="grid grid-cols-8 gap-1 mb-6">
              {Array(64).fill(0).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-sm"
                  style={{
                    backgroundColor: `hsl(${(i * 20 + index * 30) % 360}, 60%, 50%)`,
                    opacity: Math.random() > 0.4 ? 0.8 : 0.3
                  }}
                  animate={{
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-2">{word}</h2>
            <p className="text-center text-sm" style={{ color: '#64748b' }}>点击查看释义</p>
          </div>

          {/* Back */}
          <div
            className="p-8 rounded-xl border absolute inset-0"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
              borderColor: '#3b82f6'
            }}
          >
            <h3 className="text-2xl font-bold text-white text-center mb-4">{meaning}</h3>
            <p className="text-center text-sm italic" style={{ color: '#94a3b8' }}>"{example}"</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30"
          style={{ background: '#1e293b', color: '#94a3b8' }}
        >
          ← 上一张
        </button>
        <span style={{ color: '#64748b' }}>{index + 1} / {total}</span>
        <button
          onClick={onNext}
          disabled={index === total - 1}
          className="px-4 py-2 rounded-lg text-sm font-medium transition disabled:opacity-30"
          style={{ background: '#1e293b', color: '#94a3b8' }}
        >
          下一张 →
        </button>
      </div>
    </div>
  )
}