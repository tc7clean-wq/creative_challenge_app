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
      className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl 
                   border border-cyan-500/30 w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 
                          rounded-xl flex items-center justify-center">
              <BsMagic className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create with AI</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Left Panel - Input */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Content Type Selection */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-3 block">Content Type</label>
              <div className="grid grid-cols-4 gap-3">
                {contentTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setContentType(type.id as 'text' | 'image' | 'video' | 'audio')}
                    className={`p-3 rounded-xl border transition-all ${
                      contentType === type.id
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-500/50 text-white'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <div className="text-2xl">{type.icon}</div>
                      <span className="text-sm">{type.label}</span>
                    </div>
                  </button>
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