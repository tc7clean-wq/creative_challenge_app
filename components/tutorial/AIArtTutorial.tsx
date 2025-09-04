'use client'

import { useState } from 'react'

interface AIArtTutorialProps {
  className?: string
}

export default function AIArtTutorial({ className = '' }: AIArtTutorialProps) {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      title: '🎯 Choose Your AI Tool',
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            You can use any AI art generator! Here are some popular free options:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">🆓 Free Options</h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• <strong>DALL-E 3</strong> (OpenAI)</li>
                <li>• <strong>Midjourney</strong> (Free tier)</li>
                <li>• <strong>Stable Diffusion</strong> (Hugging Face)</li>
                <li>• <strong>Bing Image Creator</strong> (Microsoft)</li>
                <li>• <strong>Leonardo.ai</strong> (Free credits)</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h4 className="font-semibold text-white mb-2">💎 Premium Options</h4>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• <strong>Midjourney Pro</strong></li>
                <li>• <strong>Adobe Firefly</strong></li>
                <li>• <strong>Runway ML</strong></li>
                <li>• <strong>Artbreeder</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '✍️ Write Your Prompt',
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Great prompts create great art! Here&apos;s how to write effective prompts:
          </p>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="font-semibold text-white mb-3">📝 Prompt Structure</h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-blue-400 font-medium">Subject:</span>
                <span className="text-white/70 ml-2">&quot;A majestic dragon&quot;</span>
              </div>
              <div>
                <span className="text-green-400 font-medium">Style:</span>
                <span className="text-white/70 ml-2">&quot;digital art, fantasy art style&quot;</span>
              </div>
              <div>
                <span className="text-purple-400 font-medium">Details:</span>
                <span className="text-white/70 ml-2">&quot;flying over mountains, golden scales&quot;</span>
              </div>
              <div>
                <span className="text-yellow-400 font-medium">Quality:</span>
                <span className="text-white/70 ml-2">&quot;high resolution, detailed, 4K&quot;</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2">💡 Pro Tips</h4>
            <ul className="text-blue-200 text-sm space-y-1">
              <li>• Be specific about colors, lighting, and mood</li>
              <li>• Include artistic styles: &quot;oil painting&quot;, &quot;watercolor&quot;, &quot;anime style&quot;</li>
              <li>• Add quality keywords: &quot;masterpiece&quot;, &quot;award-winning&quot;, &quot;professional&quot;</li>
              <li>• Use negative prompts to avoid unwanted elements</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '🎨 Generate Your Art',
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Now it&apos;s time to create! Here&apos;s the process:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div>
                <h4 className="font-semibold text-white">Enter Your Prompt</h4>
                <p className="text-white/70 text-sm">Copy your well-crafted prompt into the AI tool</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <div>
                <h4 className="font-semibold text-white">Adjust Settings</h4>
                <p className="text-white/70 text-sm">Set resolution, style strength, and other parameters</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div>
                <h4 className="font-semibold text-white">Generate & Refine</h4>
                <p className="text-white/70 text-sm">Create multiple variations and pick your favorite</p>
              </div>
            </div>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-yellow-300 font-semibold mb-2">⚠️ Important</h4>
            <p className="text-yellow-200 text-sm">
              Make sure you have the rights to use the generated image. Most AI tools give you commercial rights, but always check their terms!
            </p>
          </div>
        </div>
      )
    },
    {
      title: '📤 Submit to Contest',
      content: (
        <div className="space-y-4">
          <p className="text-white/80">
            Ready to compete? Here&apos;s how to submit your AI masterpiece:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
              <div>
                <h4 className="font-semibold text-white">Download Your Art</h4>
                <p className="text-white/70 text-sm">Save your image in high quality (PNG or JPG)</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
              <div>
                <h4 className="font-semibold text-white">Create Your Entry</h4>
                <p className="text-white/70 text-sm">Give it a creative title and description</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
              <div>
                <h4 className="font-semibold text-white">Upload & Submit</h4>
                <p className="text-white/70 text-sm">Upload your image and submit to the contest</p>
              </div>
            </div>
          </div>
          <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4">
            <h4 className="text-green-300 font-semibold mb-2">🏆 Winning Tips</h4>
            <ul className="text-green-200 text-sm space-y-1">
              <li>• Make sure your art matches the contest theme</li>
              <li>• Write a compelling description of your creative process</li>
              <li>• Share your entry on social media to get more votes</li>
              <li>• Engage with other artists&apos; work</li>
            </ul>
          </div>
        </div>
      )
    }
  ]

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          🎨 How to Create AI Art for Contests
        </h3>
        <p className="text-white/70">
          Learn how to create stunning AI-generated art and submit it to win prizes!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-white/60 mb-2">
          <span>Step {activeStep + 1} of {steps.length}</span>
          <span>{Math.round(((activeStep + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-6">
        <h4 className="text-xl font-bold text-white mb-4">
          {steps[activeStep].title}
        </h4>
        {steps[activeStep].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>←</span>
          <span>Previous</span>
        </button>

        <div className="flex gap-2">
          {steps.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === activeStep 
                  ? 'bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
          disabled={activeStep === steps.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <span>→</span>
        </button>
      </div>

      {/* Quick Start */}
      <div className="mt-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg p-4">
        <h4 className="text-green-300 font-semibold mb-2">🚀 Quick Start</h4>
        <p className="text-green-200 text-sm mb-3">
          <strong>Quick Steps to Get Started:</strong>
        </p>
        <ol className="text-green-200 text-sm space-y-1 list-decimal list-inside">
          <li>Choose your AI art tool: <strong>DALL-E 3</strong>, <strong>Midjourney</strong>, or <strong>Stable Diffusion</strong></li>
          <li>Craft a detailed prompt describing your creative vision</li>
          <li>Generate multiple variations and select your best artwork</li>
          <li>Upload your masterpiece and enter it in our creative contest!</li>
        </ol>
      </div>
    </div>
  )
}
