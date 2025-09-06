'use client'

import { useState, useEffect, useRef } from 'react'

interface Track {
  id: string
  title: string
  artist: string
  url: string
  duration: number
}

// Free cyberpunk/electronic music tracks (using royalty-free sources)
const CYBERPUNK_PLAYLIST: Track[] = [
  {
    id: '1',
    title: 'Neon Dreams',
    artist: 'Cyber Synth',
    url: 'https://www.soundjay.com/misc/sounds/cyberpunk-ambient-1.mp3', // Placeholder - replace with actual free music
    duration: 180
  },
  {
    id: '2', 
    title: 'Digital Rain',
    artist: 'Matrix Beats',
    url: 'https://www.soundjay.com/misc/sounds/cyberpunk-ambient-2.mp3', // Placeholder
    duration: 240
  },
  {
    id: '3',
    title: 'Circuit Breaker',
    artist: 'Electric Pulse',
    url: 'https://www.soundjay.com/misc/sounds/cyberpunk-ambient-3.mp3', // Placeholder
    duration: 200
  },
  {
    id: '4',
    title: 'Holographic',
    artist: 'Future Bass',
    url: 'https://www.soundjay.com/misc/sounds/cyberpunk-ambient-4.mp3', // Placeholder
    duration: 220
  }
]

export default function CyberpunkMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const track = CYBERPUNK_PLAYLIST[currentTrack]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => {
      setCurrentTime(0)
      setIsPlaying(false)
      // Auto-play next track
      if (currentTrack < CYBERPUNK_PLAYLIST.length - 1) {
        setCurrentTrack(prev => prev + 1)
      } else {
        setCurrentTrack(0)
      }
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.play().catch(console.error)
    } else {
      audio.pause()
    }
  }, [isPlaying, currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
  }, [volume])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const nextTrack = () => {
    setCurrentTrack(prev => (prev + 1) % CYBERPUNK_PLAYLIST.length)
    setCurrentTime(0)
  }

  const prevTrack = () => {
    setCurrentTrack(prev => (prev - 1 + CYBERPUNK_PLAYLIST.length) % CYBERPUNK_PLAYLIST.length)
    setCurrentTime(0)
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = parseFloat(e.target.value)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={track.url}
        preload="metadata"
      />
      
      {/* Compact Player */}
      <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-16'
      }`}>
        <div className="cyber-card cyber-glow">
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-cyan-400/30">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full cyber-pulse"></div>
              <span className="text-cyan-400 text-sm font-bold">MUSIC</span>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {isExpanded ? '−' : '♪'}
            </button>
          </div>

          {isExpanded && (
            <div className="p-4 space-y-4">
              {/* Track Info */}
              <div className="text-center">
                <h3 className="text-white font-bold text-sm truncate">{track.title}</h3>
                <p className="text-cyan-300 text-xs">{track.artist}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-cyan-300">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={prevTrack}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ⏮
                </button>
                <button
                  onClick={togglePlay}
                  className="cyber-btn px-4 py-2 rounded-full text-xs"
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>
                <button
                  onClick={nextTrack}
                  className="text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  ⏭
                </button>
              </div>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <span className="text-cyan-400 text-xs">VOL</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                />
                <span className="text-cyan-300 text-xs">{Math.round(volume * 100)}</span>
              </div>

              {/* Playlist */}
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {CYBERPUNK_PLAYLIST.map((t, index) => (
                  <button
                    key={t.id}
                    onClick={() => setCurrentTrack(index)}
                    className={`w-full text-left p-2 rounded text-xs transition-colors ${
                      index === currentTrack
                        ? 'bg-cyan-400/20 text-cyan-300'
                        : 'text-gray-400 hover:text-cyan-300 hover:bg-cyan-400/10'
                    }`}
                  >
                    <div className="truncate">{t.title}</div>
                    <div className="text-xs opacity-75">{t.artist}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compact View */}
          {!isExpanded && (
            <div className="p-3 text-center">
              <button
                onClick={togglePlay}
                className="text-cyan-400 hover:text-cyan-300 transition-colors text-lg"
              >
                {isPlaying ? '⏸' : '▶'}
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00ffff, #ff0080);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: linear-gradient(45deg, #00ffff, #ff0080);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        }
      `}</style>
    </>
  )
}
