// Advanced Animations and Micro-interactions System
import { motion, AnimatePresence, useAnimation, useInView } from 'framer-motion'

interface AnimationConfig {
  duration: number
  delay: number
  ease: string
  repeat?: number
  repeatType?: 'loop' | 'reverse' | 'mirror'
  repeatDelay?: number
}

interface MicroInteraction {
  trigger: 'hover' | 'click' | 'focus' | 'scroll' | 'load'
  animation: string
  config: AnimationConfig
  target?: string
}

interface ParticleSystem {
  count: number
  color: string
  size: { min: number; max: number }
  speed: { min: number; max: number }
  life: { min: number; max: number }
  gravity: number
  wind: { x: number; y: number }
}

class AnimationManager {
  private animations = new Map<string, any>()
  private microInteractions = new Map<string, MicroInteraction[]>()
  private particleSystems = new Map<string, ParticleSystem>()

  // Predefined animation variants
  getAnimationVariants() {
    return {
      // Page transitions
      pageTransition: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      },
      
      // Card animations
      cardHover: {
        hover: { 
          scale: 1.05, 
          rotateY: 5,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        },
        tap: { scale: 0.95 }
      },
      
      // Button animations
      buttonPress: {
        tap: { scale: 0.95 },
        hover: { scale: 1.02 }
      },
      
      // Loading animations
      loadingSpinner: {
        animate: { rotate: 360 },
        transition: { duration: 1, repeat: Infinity, ease: 'linear' }
      },
      
      // Text animations
      textReveal: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: 'easeOut' }
      },
      
      // Image animations
      imageReveal: {
        initial: { opacity: 0, scale: 0.8 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.8, ease: 'easeOut' }
      },
      
      // List animations
      listItem: {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 20 }
      },
      
      // Modal animations
      modalBackdrop: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      modalContent: {
        initial: { opacity: 0, scale: 0.8, y: 20 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.8, y: 20 }
      },
      
      // Stagger animations
      staggerContainer: {
        animate: {
          transition: {
            staggerChildren: 0.1
          }
        }
      },
      
      // Parallax animations
      parallax: {
        y: [0, -50],
        transition: { duration: 2, ease: 'easeOut' }
      },
      
      // Morphing animations
      morph: {
        initial: { borderRadius: '0%' },
        animate: { borderRadius: '50%' },
        transition: { duration: 0.5 }
      },
      
      // Glitch effects
      glitch: {
        animate: {
          x: [0, -2, 2, -2, 2, 0],
          y: [0, 2, -2, 2, -2, 0],
          transition: { duration: 0.1, repeat: 3 }
        }
      },
      
      // Pulse animations
      pulse: {
        animate: {
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
          transition: { duration: 2, repeat: Infinity }
        }
      },
      
      // Bounce animations
      bounce: {
        animate: {
          y: [0, -20, 0],
          transition: { duration: 0.6, ease: 'easeOut' }
        }
      },
      
      // Shake animations
      shake: {
        animate: {
          x: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.5 }
        }
      },
      
      // Fade animations
      fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 }
      },
      
      // Slide animations
      slideInLeft: {
        initial: { x: -100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 }
      },
      slideInRight: {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: 100, opacity: 0 }
      },
      slideInUp: {
        initial: { y: 100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: 100, opacity: 0 }
      },
      slideInDown: {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 }
      },
      
      // Scale animations
      scaleIn: {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0, opacity: 0 }
      },
      
      // Rotate animations
      rotateIn: {
        initial: { rotate: -180, opacity: 0 },
        animate: { rotate: 0, opacity: 1 },
        exit: { rotate: 180, opacity: 0 }
      }
    }
  }

  // Create custom animation
  createAnimation(name: string, config: any): void {
    this.animations.set(name, config)
  }

  // Get animation by name
  getAnimation(name: string): any {
    return this.animations.get(name) || this.getAnimationVariants()[name]
  }

  // Create micro-interaction
  createMicroInteraction(
    elementId: string,
    interaction: MicroInteraction
  ): void {
    if (!this.microInteractions.has(elementId)) {
      this.microInteractions.set(elementId, [])
    }
    this.microInteractions.get(elementId)!.push(interaction)
  }

  // Apply micro-interactions to element
  applyMicroInteractions(elementId: string): void {
    const interactions = this.microInteractions.get(elementId)
    if (!interactions) return

    const element = document.getElementById(elementId)
    if (!element) return

    interactions.forEach(interaction => {
      switch (interaction.trigger) {
        case 'hover':
          element.addEventListener('mouseenter', () => {
            this.triggerAnimation(element, interaction.animation, interaction.config)
          })
          break
        case 'click':
          element.addEventListener('click', () => {
            this.triggerAnimation(element, interaction.animation, interaction.config)
          })
          break
        case 'focus':
          element.addEventListener('focus', () => {
            this.triggerAnimation(element, interaction.animation, interaction.config)
          })
          break
        case 'scroll':
          this.setupScrollAnimation(element, interaction)
          break
        case 'load':
          this.triggerAnimation(element, interaction.animation, interaction.config)
          break
      }
    })
  }

  // Create particle system
  createParticleSystem(
    id: string,
    config: ParticleSystem,
    container: HTMLElement
  ): void {
    this.particleSystems.set(id, config)
    this.renderParticleSystem(id, container)
  }

  // Render particle system
  private renderParticleSystem(id: string, container: HTMLElement): void {
    const config = this.particleSystems.get(id)
    if (!config) return

    const canvas = document.createElement('canvas')
    canvas.style.position = 'absolute'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '1'
    
    container.appendChild(canvas)
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      color: string
    }> = []

    // Create particles
    for (let i = 0; i < config.count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
        vy: (Math.random() - 0.5) * (config.speed.max - config.speed.min) + config.speed.min,
        life: Math.random() * (config.life.max - config.life.min) + config.life.min,
        maxLife: Math.random() * (config.life.max - config.life.min) + config.life.min,
        size: Math.random() * (config.size.max - config.size.min) + config.size.min,
        color: config.color
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((particle, index) => {
        // Update particle
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += config.gravity
        particle.vx += config.wind.x
        particle.vy += config.wind.y
        particle.life -= 1

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.life / particle.maxLife
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Reset particle if dead
        if (particle.life <= 0) {
          particle.x = Math.random() * canvas.width
          particle.y = Math.random() * canvas.height
          particle.life = particle.maxLife
        }
      })

      requestAnimationFrame(animate)
    }

    animate()
  }

  // Trigger animation on element
  private triggerAnimation(
    element: HTMLElement,
    animationName: string,
    config: AnimationConfig
  ): void {
    const animation = this.getAnimation(animationName)
    if (!animation) return

    // Apply animation using CSS or custom implementation
    element.style.transition = `all ${config.duration}s ${config.ease}`
    
    if (animation.animate) {
      Object.keys(animation.animate).forEach(key => {
        element.style[key as any] = animation.animate[key]
      })
    }
  }

  // Setup scroll animation
  private setupScrollAnimation(
    element: HTMLElement,
    interaction: MicroInteraction
  ): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerAnimation(element, interaction.animation, interaction.config)
          }
        })
      },
      { threshold: 0.1 }
    )
    
    observer.observe(element)
  }

  // Create morphing animation
  createMorphingAnimation(
    fromElement: HTMLElement,
    toElement: HTMLElement,
    duration: number = 0.5
  ): void {
    const fromRect = fromElement.getBoundingClientRect()
    const toRect = toElement.getBoundingClientRect()
    
    const morphElement = fromElement.cloneNode(true) as HTMLElement
    morphElement.style.position = 'fixed'
    morphElement.style.top = `${fromRect.top}px`
    morphElement.style.left = `${fromRect.left}px`
    morphElement.style.width = `${fromRect.width}px`
    morphElement.style.height = `${fromRect.height}px`
    morphElement.style.zIndex = '9999'
    morphElement.style.pointerEvents = 'none'
    
    document.body.appendChild(morphElement)
    
    // Animate morphing
    morphElement.animate([
      {
        top: `${fromRect.top}px`,
        left: `${fromRect.left}px`,
        width: `${fromRect.width}px`,
        height: `${fromRect.height}px`,
        borderRadius: '0px'
      },
      {
        top: `${toRect.top}px`,
        left: `${toRect.left}px`,
        width: `${toRect.width}px`,
        height: `${toRect.height}px`,
        borderRadius: '50%'
      }
    ], {
      duration: duration * 1000,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      fill: 'forwards'
    }).onfinish = () => {
      document.body.removeChild(morphElement)
    }
  }

  // Create ripple effect
  createRippleEffect(
    element: HTMLElement,
    event: MouseEvent,
    color: string = 'rgba(255, 255, 255, 0.6)'
  ): void {
    const rect = element.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2
    
    const ripple = document.createElement('div')
    ripple.style.position = 'absolute'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    ripple.style.width = `${size}px`
    ripple.style.height = `${size}px`
    ripple.style.borderRadius = '50%'
    ripple.style.background = color
    ripple.style.transform = 'scale(0)'
    ripple.style.animation = 'ripple 0.6s linear'
    ripple.style.pointerEvents = 'none'
    
    element.style.position = 'relative'
    element.style.overflow = 'hidden'
    element.appendChild(ripple)
    
    setTimeout(() => {
      ripple.remove()
    }, 600)
  }

  // Create typing animation
  createTypingAnimation(
    element: HTMLElement,
    text: string,
    speed: number = 50
  ): void {
    let index = 0
    element.textContent = ''
    
    const type = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index)
        index++
        setTimeout(type, speed)
      }
    }
    
    type()
  }

  // Create loading animation
  createLoadingAnimation(
    element: HTMLElement,
    type: 'spinner' | 'dots' | 'pulse' | 'wave' = 'spinner'
  ): void {
    const loader = document.createElement('div')
    loader.className = `loader loader-${type}`
    
    switch (type) {
      case 'spinner':
        loader.innerHTML = '<div class="spinner"></div>'
        break
      case 'dots':
        loader.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>'
        break
      case 'pulse':
        loader.innerHTML = '<div class="pulse"></div>'
        break
      case 'wave':
        loader.innerHTML = '<div class="wave"></div><div class="wave"></div><div class="wave"></div>'
        break
    }
    
    element.appendChild(loader)
  }
}

// Global animation manager
export const animationManager = new AnimationManager()

// React hook for animations
export function useAnimations() {
  const controls = useAnimation()
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true })

  React.useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  const triggerAnimation = (animationName: string) => {
    controls.start(animationName)
  }

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    animationManager.createRippleEffect(event.currentTarget, event.nativeEvent)
  }

  const createTyping = (text: string, speed: number = 50) => {
    if (ref.current) {
      animationManager.createTypingAnimation(ref.current, text, speed)
    }
  }

  return {
    controls,
    ref,
    isInView,
    triggerAnimation,
    createRipple,
    createTyping
  }
}

// CSS for animations
export const animationStyles = `
  @keyframes ripple {
    0% {
      transform: scale(0);
      opacity: 1;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }

  .loader-spinner .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .loader-dots {
    display: flex;
    gap: 4px;
  }

  .loader-dots .dot {
    width: 8px;
    height: 8px;
    background: #3498db;
    border-radius: 50%;
    animation: bounce 1.4s ease-in-out infinite both;
  }

  .loader-dots .dot:nth-child(1) { animation-delay: -0.32s; }
  .loader-dots .dot:nth-child(2) { animation-delay: -0.16s; }

  .loader-pulse .pulse {
    width: 40px;
    height: 40px;
    background: #3498db;
    border-radius: 50%;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .loader-wave {
    display: flex;
    gap: 4px;
  }

  .loader-wave .wave {
    width: 4px;
    height: 20px;
    background: #3498db;
    animation: wave 1.2s ease-in-out infinite;
  }

  .loader-wave .wave:nth-child(1) { animation-delay: -0.4s; }
  .loader-wave .wave:nth-child(2) { animation-delay: -0.2s; }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
    }
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
    }
  }

  @keyframes wave {
    0%, 40%, 100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }
`

export type { AnimationConfig, MicroInteraction, ParticleSystem }
