'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiX, FiImage, FiMusic, FiVideo, FiType, 
  FiZap, FiSliders, FiRefreshCw, FiUpload 
} from 'react-icons/fi'
import { BsStars, BsRobot, BsMagic } from 'react-icons/bs'
import Image from 'next/image'

interface AICreatePostProps {
  onClose: () => void
}

export default function AICreatePost({ onClose }: AICreatePostProps) {
  const [prompt, setPrompt] = useState('')
  const [contentType, setContentType] = useState<'text' | 'image' | 'video' | 'audio'>('image')
  const [model, setModel] = useState('dall-e-3')
  const [style, setStyle] = useState('realistic')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const contentTypes = [
    { id: 'text', label: 'Text', icon: <FiType />, models: ['gpt-4', 'claude-3', 'llama-2'] },
    { id: 'image', label: 'Image', icon: <FiImage />, models: ['dall-e-3', 'midjourney', 'stable-diffusion'] },
    { id: 'video', label: 'Video', icon: <FiVideo />, models: ['runway', 'pika', 'genmo'] },
    { id: 'audio', label: 'Audio', icon: <FiMusic />, models: ['musicgen', 'audiocraft', 'riffusion'] }
  ]

  const styles = [
    'Realistic', 'Artistic', 'Cyberpunk', 'Fantasy', 'Minimalist', 
    'Vintage', 'Futuristic', 'Abstract', 'Photographic', 'Anime'
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    setGeneratedContent('https://images.unsplash.com/photo-1686779601812-00d8e7c62785?w=800')
    setIsGenerating(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4
               before:absolute before:inset-0 before:bg-gradient-radial before:from-cyan-500/10 before:to-transparent"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, rotateY: -30 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.8, opacity: 0, rotateY: 30 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="glass-card-intense rounded-3xl neural-glow w-full max-w-6xl max-h-[95vh] overflow-hidden
                   shadow-2xl shadow-cyan-500/20 border-2 border-cyan-400/30 perspective-1000"
      >
        {/* Header */}
        <div className="p-8 border-b border-gradient-to-r from-transparent via-cyan-500/30 to-transparent
                      bg-gradient-to-r from-gray-900/20 via-gray-800/30 to-gray-900/20
                      flex items-center justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/10 to-pink-500/5 pointer-events-none" />
          <div className="flex items-center space-x-4 relative z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 glass-card-intense neural-glow rounded-2xl
                        flex items-center justify-center morph-button relative overflow-hidden">
              <BsMagic className="w-8 h-8 text-cyan-300" />
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-2xl" />
            </motion.div>
            <h2 className="text-4xl font-bold text-neural tracking-wide">Create with AI</h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-3 glass-card hover:neural-glow rounded-xl transition-all duration-300 relative z-10"
          >
            <FiX className="w-7 h-7 text-gray-300" />
          </motion.button>
        </div>

        <div className="flex h-[calc(95vh-140px)] relative">
          {/* Left Panel - Input */}
          <div className="flex-1 p-8 overflow-y-auto glass-card relative
                        before:absolute before:inset-0 before:bg-gradient-to-br
                        before:from-cyan-500/5 before:via-purple-500/5 before:to-pink-500/5
                        before:pointer-events-none">
            {/* Content Type Selection */}
            <div className="mb-8 relative z-10">
              <label className="text-lg text-neural font-semibold mb-4 block tracking-wide">Content Type</label>
              <div className="grid grid-cols-4 gap-3">
                {contentTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    whileHover={{ scale: 1.05, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setContentType(type.id as 'text' | 'image' | 'video' | 'audio')}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 group ${
                      contentType === type.id
                        ? 'glass-card-intense neural-glow text-white border-cyan-500/50 morph-button'
                        : 'glass-card border-gray-700/50 text-gray-400 hover:border-cyan-500/30 hover:neural-glow hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-3 relative">
                      <motion.div
                        animate={contentType === type.id ? { rotate: 360 } : {}}
                        transition={{ duration: 2, ease: "linear" }}
                        className="text-3xl group-hover:scale-110 transition-transform duration-300"
                      >
                        {type.icon}
                      </motion.div>
                      <span className="text-sm font-medium">{type.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* AI Model Selection */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">AI Model</label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.find(t => t.id === contentType)?.models.map((m) => (
                  <button
                    key={m}
                    onClick={() => setModel(m)}
                    className={`px-4 py-2 rounded-lg text-sm transition-all ${
                      model === m
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt Input */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">
                Describe what you want to create
              </label>
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city with flying cars and neon lights..."
                  className="w-full h-32 bg-gray-800/50 border border-gray-700 rounded-xl 
                           p-4 text-white placeholder-gray-500 resize-none
                           focus:outline-none focus:border-cyan-500/50"
                />
                <button className="absolute bottom-3 right-3 p-2 bg-purple-500/20 
                               text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors">
                  <BsStars className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Style Selection */}
            {contentType === 'image' && (
              <div className="mb-6">
                <label className="text-sm text-gray-400 mb-3 block">Style</label>
                <div className="flex flex-wrap gap-2">
                  {styles.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s.toLowerCase())}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                        style === s.toLowerCase()
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300'
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Advanced Settings */}
            <div className="mb-6">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
              >
                <FiSliders className="w-4 h-4" />
                <span className="text-sm">Advanced Settings</span>
              </button>
              
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 space-y-4 overflow-hidden"
                  >
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Creativity</label>
                      <input
                        type="range"
                        className="w-full"
                        min="0"
                        max="100"
                        defaultValue="70"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-2 block">Quality</label>
                      <select className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white">
                        <option>Standard</option>
                        <option>High</option>
                        <option>Ultra</option>
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generate Button */}
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 
                         text-white font-semibold rounded-xl hover:opacity-90 
                         transition-opacity disabled:opacity-50 flex items-center 
                         justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <FiRefreshCw className="w-5 h-5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FiZap className="w-5 h-5" />
                    <span>Generate</span>
                  </>
                )}
              </motion.button>
              
              <button className="p-3 bg-gray-800 text-gray-400 rounded-xl 
                             hover:bg-gray-700 transition-colors">
                <FiUpload className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 bg-gray-900/50 p-6 border-l border-gray-700/50">
            <div className="h-full flex flex-col">
              <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
              
              {generatedContent ? (
                <div className="flex-1 relative rounded-xl overflow-hidden">
                  <Image
                    src={generatedContent}
                    alt="Generated content"
                    className="w-full h-full object-cover"
                    width={400}
                    height={400}
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="bg-black/70 backdrop-blur-xl rounded-lg px-3 py-2">
                      <p className="text-xs text-gray-400">Generated with {model}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-black/70 backdrop-blur-xl rounded-lg 
                                     text-white hover:bg-black/80 transition-colors">
                        <FiRefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center border-2 border-dashed 
                             border-gray-700 rounded-xl">
                  <div className="text-center">
                    <BsRobot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Your AI creation will appear here</p>
                  </div>
                </div>
              )}

              {generatedContent && (
                <div className="mt-4 flex items-center space-x-3">
                  <button className="flex-1 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 
                                 text-white font-medium rounded-lg hover:opacity-90 transition-opacity">
                    Post to Feed
                  </button>
                  <button className="flex-1 py-2 bg-gray-800 text-gray-400 rounded-lg 
                                 hover:bg-gray-700 transition-colors">
                    Save as Draft
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}