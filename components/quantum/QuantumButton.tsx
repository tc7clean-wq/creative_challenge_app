'use client'

import { ReactNode, useState } from 'react'

interface QuantumButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export default function QuantumButton({ 
  children, 
  onClick, 
  href, 
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}: QuantumButtonProps) {
  const [isPressed, setIsPressed] = useState(false)

  const baseClasses = "relative overflow-hidden transition-all duration-300 font-semibold rounded-2xl cursor-pointer"
  
  const variantClasses = {
    primary: "quantum-button",
    secondary: "quantum-hover quantum-glass text-white",
    ghost: "quantum-hover text-white/70 hover:text-white"
  }
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  const handleMouseDown = () => setIsPressed(true)
  const handleMouseUp = () => setIsPressed(false)
  const handleMouseLeave = () => setIsPressed(false)

  const buttonClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${isPressed ? 'quantum-press' : ''}
    ${className}
  `.trim()

  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </a>
    )
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  )
}
