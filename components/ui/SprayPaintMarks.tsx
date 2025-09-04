'use client'

export default function SprayPaintMarks() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="none">
        <defs>
          {/* Spray paint gradients - realistic spray can colors */}
          <radialGradient id="sprayPink" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff1493" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#ff69b4" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffb6c1" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayBlue" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#00bfff" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#87ceeb" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#b0e0e6" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayGreen" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#32cd32" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#90ee90" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#98fb98" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayOrange" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ff4500" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#ffa500" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayRed" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#dc143c" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#ff6b6b" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffa8a8" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayPurple" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#8a2be2" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#ba55d3" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#dda0dd" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayYellow" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#ffff00" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#ffffe0" stopOpacity="0.4"/>
          </radialGradient>
          <radialGradient id="sprayCyan" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#00ced1" stopOpacity="0.9"/>
            <stop offset="50%" stopColor="#20b2aa" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#afeeee" stopOpacity="0.4"/>
          </radialGradient>
          
          {/* Spray paint texture filter */}
          <filter id="sprayTexture" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.8" numOctaves="3" result="noise"/>
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2"/>
          </filter>
        </defs>
        
        {/* Spray Paint Mark 1 - Pink splatter */}
        <ellipse cx="150" cy="200" rx="45" ry="25" fill="url(#sprayPink)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="180" cy="180" rx="25" ry="15" fill="url(#sprayPink)" opacity="0.6"/>
        <ellipse cx="120" cy="220" rx="15" ry="8" fill="url(#sprayPink)" opacity="0.7"/>
        
        {/* Spray Paint Mark 2 - Blue splatter */}
        <ellipse cx="950" cy="300" rx="40" ry="30" fill="url(#sprayBlue)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="980" cy="280" rx="20" ry="12" fill="url(#sprayBlue)" opacity="0.6"/>
        <ellipse cx="920" cy="320" rx="12" ry="6" fill="url(#sprayBlue)" opacity="0.7"/>
        
        {/* Spray Paint Mark 3 - Green splatter */}
        <ellipse cx="400" cy="500" rx="50" ry="35" fill="url(#sprayGreen)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="430" cy="480" rx="30" ry="18" fill="url(#sprayGreen)" opacity="0.6"/>
        <ellipse cx="370" cy="520" rx="18" ry="10" fill="url(#sprayGreen)" opacity="0.7"/>
        
        {/* Spray Paint Mark 4 - Orange splatter */}
        <ellipse cx="750" cy="150" rx="35" ry="20" fill="url(#sprayOrange)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="780" cy="130" rx="22" ry="12" fill="url(#sprayOrange)" opacity="0.6"/>
        <ellipse cx="720" cy="170" rx="14" ry="7" fill="url(#sprayOrange)" opacity="0.7"/>
        
        {/* Spray Paint Mark 5 - Red splatter */}
        <ellipse cx="600" cy="600" rx="42" ry="28" fill="url(#sprayRed)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="630" cy="580" rx="25" ry="15" fill="url(#sprayRed)" opacity="0.6"/>
        <ellipse cx="570" cy="620" rx="16" ry="9" fill="url(#sprayRed)" opacity="0.7"/>
        
        {/* Spray Paint Mark 6 - Purple splatter */}
        <ellipse cx="300" cy="350" rx="38" ry="22" fill="url(#sprayPurple)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="330" cy="330" rx="24" ry="14" fill="url(#sprayPurple)" opacity="0.6"/>
        <ellipse cx="270" cy="370" rx="15" ry="8" fill="url(#sprayPurple)" opacity="0.7"/>
        
        {/* Spray Paint Mark 7 - Yellow splatter */}
        <ellipse cx="500" cy="100" rx="48" ry="32" fill="url(#sprayYellow)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="530" cy="80" rx="28" ry="16" fill="url(#sprayYellow)" opacity="0.6"/>
        <ellipse cx="470" cy="120" rx="18" ry="10" fill="url(#sprayYellow)" opacity="0.7"/>
        
        {/* Spray Paint Mark 8 - Cyan splatter */}
        <ellipse cx="800" cy="450" rx="44" ry="26" fill="url(#sprayCyan)" filter="url(#sprayTexture)" opacity="0.8"/>
        <ellipse cx="830" cy="430" rx="26" ry="15" fill="url(#sprayCyan)" opacity="0.6"/>
        <ellipse cx="770" cy="470" rx="17" ry="9" fill="url(#sprayCyan)" opacity="0.7"/>
        
        {/* Additional spray paint marks for coverage */}
        <ellipse cx="200" cy="600" rx="32" ry="18" fill="url(#sprayPink)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="1000" cy="500" rx="36" ry="24" fill="url(#sprayBlue)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="350" cy="100" rx="28" ry="16" fill="url(#sprayGreen)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="650" cy="300" rx="40" ry="25" fill="url(#sprayOrange)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="150" cy="400" rx="34" ry="20" fill="url(#sprayRed)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="1050" cy="150" rx="30" ry="18" fill="url(#sprayPurple)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="450" cy="700" rx="38" ry="22" fill="url(#sprayYellow)" filter="url(#sprayTexture)" opacity="0.7"/>
        <ellipse cx="700" cy="50" rx="26" ry="14" fill="url(#sprayCyan)" filter="url(#sprayTexture)" opacity="0.7"/>
        
        {/* Small spray paint dots and marks */}
        <circle cx="120" cy="120" r="8" fill="url(#sprayPink)" opacity="0.6"/>
        <circle cx="1080" cy="200" r="6" fill="url(#sprayBlue)" opacity="0.6"/>
        <circle cx="250" cy="250" r="10" fill="url(#sprayGreen)" opacity="0.6"/>
        <circle cx="850" cy="350" r="7" fill="url(#sprayOrange)" opacity="0.6"/>
        <circle cx="180" cy="550" r="9" fill="url(#sprayRed)" opacity="0.6"/>
        <circle cx="1020" cy="650" r="5" fill="url(#sprayPurple)" opacity="0.6"/>
        <circle cx="320" cy="50" r="8" fill="url(#sprayYellow)" opacity="0.6"/>
        <circle cx="780" cy="750" r="6" fill="url(#sprayCyan)" opacity="0.6"/>
        
        {/* More random spray paint marks */}
        <ellipse cx="550" cy="400" rx="20" ry="12" fill="url(#sprayPink)" opacity="0.5"/>
        <ellipse cx="900" cy="600" rx="24" ry="16" fill="url(#sprayBlue)" opacity="0.5"/>
        <ellipse cx="150" cy="300" rx="18" ry="10" fill="url(#sprayGreen)" opacity="0.5"/>
        <ellipse cx="750" cy="200" rx="22" ry="14" fill="url(#sprayOrange)" opacity="0.5"/>
        <ellipse cx="400" cy="650" rx="26" ry="18" fill="url(#sprayRed)" opacity="0.5"/>
        <ellipse cx="1000" cy="400" rx="16" ry="9" fill="url(#sprayPurple)" opacity="0.5"/>
        <ellipse cx="300" cy="150" rx="28" ry="16" fill="url(#sprayYellow)" opacity="0.5"/>
        <ellipse cx="600" cy="750" rx="14" ry="8" fill="url(#sprayCyan)" opacity="0.5"/>
      </svg>
    </div>
  )
}
