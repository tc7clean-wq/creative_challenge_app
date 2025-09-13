'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

export default function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -300])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.2, 0.8])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Layer 1 - Furthest */}
      <motion.div
        style={{ y: y3 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/4 left-1/4 w-96 h-96 opacity-20">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full bg-gradient-radial from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl"
          />
        </div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 opacity-15">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
            className="w-full h-full rounded-full bg-gradient-radial from-purple-600/10 via-pink-500/5 to-transparent blur-3xl"
          />
        </div>
      </motion.div>

      {/* Layer 2 - Middle */}
      <motion.div
        style={{ y: y2 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/2 left-1/3 w-64 h-64 opacity-30">
          <motion.div
            style={{ rotate, scale }}
            className="w-full h-full"
          >
            <div className="w-full h-full rounded-full bg-gradient-conic from-cyan-400/20 via-purple-500/15 via-pink-500/20 to-cyan-400/20 blur-2xl" />
          </motion.div>
        </div>
        <div className="absolute top-1/4 right-1/3 w-48 h-48 opacity-25">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-gradient-radial from-emerald-500/15 via-teal-400/10 to-transparent blur-2xl"
          />
        </div>
      </motion.div>

      {/* Layer 3 - Closest */}
      <motion.div
        style={{ y: y1 }}
        className="absolute inset-0"
      >
        <div className="absolute top-1/3 right-1/2 w-32 h-32 opacity-40">
          <motion.div
            animate={{
              x: [-10, 10, -10],
              y: [-5, 5, -5]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-gradient-to-br from-cyan-300/25 to-blue-400/20 blur-xl"
          />
        </div>
        <div className="absolute bottom-1/2 left-1/2 w-24 h-24 opacity-35">
          <motion.div
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="w-full h-full rounded-full bg-gradient-to-tr from-purple-400/30 to-pink-300/25 blur-xl"
          />
        </div>
      </motion.div>

      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 20 + 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20 blur-sm"
          style={{
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
          }}
        />
      ))}

      {/* Neural Network Lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          d="M100,100 Q500,300 900,100 T900,500 Q500,700 100,500 T100,100"
          stroke="url(#neural-gradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.3 }}
          transition={{ duration: 3, ease: "easeInOut" }}
        />
        <motion.path
          d="M200,200 Q600,100 800,400 T400,800 Q200,600 200,200"
          stroke="url(#neural-gradient-2)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.2 }}
          transition={{ duration: 4, delay: 1, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
          <linearGradient id="neural-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="50%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>

      {/* Mesh Gradient Overlay */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 40% 40%, #ec4899 0%, transparent 50%)',
              'radial-gradient(circle at 60% 20%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 20% 60%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 80% 80%, #ec4899 0%, transparent 50%)',
              'radial-gradient(circle at 20% 80%, #06b6d4 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%), radial-gradient(circle at 40% 40%, #ec4899 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}