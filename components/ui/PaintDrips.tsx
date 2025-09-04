'use client'

export default function PaintDrips() {
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
        
        {/* Professional Paint Drip 1 - Neon Pink (Realistic flow) */}
        <path d="M 120 0 
                 C 130 20 125 60 135 100 
                 C 140 140 130 180 145 220 
                 C 150 260 140 300 155 340 
                 C 160 380 150 420 165 460 
                 C 170 500 160 540 175 580 
                 C 180 620 170 660 185 700 
                 C 190 740 180 780 195 800 
                 L 105 800 
                 C 90 780 100 740 85 700 
                 C 80 660 90 620 75 580 
                 C 70 540 80 500 65 460 
                 C 60 420 70 380 55 340 
                 C 50 300 60 260 45 220 
                 C 40 180 50 140 35 100 
                 C 30 60 40 20 25 0 
                 Z" 
              fill="url(#neonPink)" 
              className="animate-drip" 
              style={{ transform: 'rotate(0.8deg)' }}/>
        
        {/* Professional Paint Drip 2 - Electric Blue (Thin with natural bulges) */}
        <path d="M 980 0 
                 C 990 40 985 120 995 200 
                 C 1000 280 990 360 1005 440 
                 C 1010 520 1000 600 1015 680 
                 C 1020 760 1010 800 1025 800 
                 L 975 800 
                 C 960 760 970 680 955 600 
                 C 950 520 960 440 945 360 
                 C 940 280 950 200 935 120 
                 C 930 40 940 0 925 0 
                 Z" 
              fill="url(#electricBlue)" 
              className="animate-drip" 
              style={{ transform: 'rotate(-1.2deg)' }}/>
        
        {/* Professional Paint Drip 3 - Lime Green (Wide with organic curves) */}
        <path d="M 380 0 
                 C 400 30 390 90 410 150 
                 C 420 210 400 270 425 330 
                 C 435 390 415 450 440 510 
                 C 450 570 430 630 455 690 
                 C 465 750 445 800 470 800 
                 L 330 800 
                 C 305 750 325 690 300 630 
                 C 290 570 310 510 285 450 
                 C 275 390 295 330 270 270 
                 C 260 210 280 150 255 90 
                 C 245 30 265 0 240 0 
                 Z" 
              fill="url(#limeGreen)" 
              className="animate-drip" 
              style={{ transform: 'rotate(0.3deg)' }}/>
        
        {/* Professional Paint Drip 4 - Hot Orange (Medium with smooth flow) */}
        <path d="M 720 0 
                 C 740 25 730 85 750 145 
                 C 760 205 740 265 765 325 
                 C 775 385 755 445 780 505 
                 C 790 565 770 625 795 685 
                 C 805 745 785 800 810 800 
                 L 690 800 
                 C 665 745 685 685 660 625 
                 C 650 565 670 505 645 445 
                 C 635 385 655 325 630 265 
                 C 620 205 640 145 615 85 
                 C 605 25 625 0 600 0 
                 Z" 
              fill="url(#hotOrange)" 
              className="animate-drip" 
              style={{ transform: 'rotate(-0.7deg)' }}/>
        
        {/* Professional Paint Drip 5 - Crimson Red (Thin with sharp curves) */}
        <path d="M 580 0 
                 C 590 50 585 150 595 250 
                 C 600 350 590 450 605 550 
                 C 610 650 600 750 615 800 
                 L 565 800 
                 C 550 750 560 650 545 550 
                 C 540 450 550 350 535 250 
                 C 530 150 540 50 525 0 
                 Z" 
              fill="url(#crimsonRed)" 
              className="animate-drip" 
              style={{ transform: 'rotate(1.8deg)' }}/>
        
        {/* Professional Paint Drip 6 - Purple Haze (Wide with multiple sections) */}
        <path d="M 280 0 
                 C 300 20 290 80 310 140 
                 C 320 200 300 260 325 320 
                 C 335 380 315 440 340 500 
                 C 350 560 330 620 355 680 
                 C 365 740 345 800 370 800 
                 L 250 800 
                 C 225 740 245 680 220 620 
                 C 210 560 230 500 205 440 
                 C 195 380 215 320 190 260 
                 C 180 200 200 140 175 80 
                 C 165 20 185 0 160 0 
                 Z" 
              fill="url(#purpleHaze)" 
              className="animate-drip" 
              style={{ transform: 'rotate(-0.4deg)' }}/>
        
        {/* Professional Paint Drip 7 - Golden Yellow (Medium with smooth flow) */}
        <path d="M 480 0 
                 C 500 35 490 95 510 155 
                 C 520 215 500 275 525 335 
                 C 535 395 515 455 540 515 
                 C 550 575 530 635 555 695 
                 C 565 755 545 800 570 800 
                 L 450 800 
                 C 425 755 445 695 420 635 
                 C 410 575 430 515 405 455 
                 C 395 395 415 335 390 275 
                 C 380 215 400 155 375 95 
                 C 365 35 385 0 360 0 
                 Z" 
              fill="url(#goldenYellow)" 
              className="animate-drip" 
              style={{ transform: 'rotate(1.1deg)' }}/>
        
        {/* Professional Paint Drip 8 - Turquoise (Thick with organic shape) */}
        <path d="M 780 0 
                 C 800 15 790 55 810 95 
                 C 820 135 800 175 825 215 
                 C 835 255 815 295 840 335 
                 C 850 375 830 415 855 455 
                 C 865 495 845 535 870 575 
                 C 880 615 860 655 885 695 
                 C 895 735 875 775 900 800 
                 L 750 800 
                 C 725 775 745 735 720 695 
                 C 710 655 730 615 705 575 
                 C 695 535 715 495 690 455 
                 C 680 415 700 375 675 335 
                 C 665 295 685 255 660 215 
                 C 650 175 670 135 645 95 
                 C 635 55 655 15 630 0 
                 Z" 
              fill="url(#turquoise)" 
              className="animate-drip" 
              style={{ transform: 'rotate(-0.9deg)' }}/>
        
        {/* Professional Paint Splatters with realistic shapes */}
        <ellipse cx="180" cy="180" rx="12" ry="8" fill="#ff0080" opacity="0.9" className="animate-pulse" transform="rotate(45 180 180)"/>
        <ellipse cx="1020" cy="280" rx="10" ry="6" fill="#00bfff" opacity="0.9" className="animate-pulse" transform="rotate(-30 1020 280)"/>
        <ellipse cx="320" cy="480" rx="14" ry="10" fill="#32cd32" opacity="0.9" className="animate-pulse" transform="rotate(60 320 480)"/>
        <ellipse cx="820" cy="580" rx="11" ry="7" fill="#ff4500" opacity="0.9" className="animate-pulse" transform="rotate(-45 820 580)"/>
        <ellipse cx="140" cy="380" rx="13" ry="9" fill="#dc143c" opacity="0.9" className="animate-pulse" transform="rotate(75 140 380)"/>
        <ellipse cx="1060" cy="480" rx="9" ry="5" fill="#8a2be2" opacity="0.9" className="animate-pulse" transform="rotate(-60 1060 480)"/>
        
        {/* Additional realistic paint drips for coverage */}
        <path d="M 650 0 
                 C 660 80 655 200 665 320 
                 C 670 440 660 560 675 680 
                 C 680 800 670 800 685 800 
                 L 635 800 
                 C 620 680 630 560 615 440 
                 C 610 320 620 200 605 80 
                 C 600 0 610 0 595 0 
                 Z" 
              fill="url(#crimsonRed)" 
              className="animate-drip" 
              style={{ transform: 'rotate(-2.1deg)' }}/>
        
        <path d="M 420 0 
                 C 440 25 430 85 450 145 
                 C 460 205 440 265 465 325 
                 C 475 385 455 445 480 505 
                 C 490 565 470 625 495 685 
                 C 505 745 485 800 510 800 
                 L 390 800 
                 C 365 745 385 685 360 625 
                 C 350 565 370 505 345 445 
                 C 335 385 355 325 330 265 
                 C 320 205 340 145 315 85 
                 C 305 25 325 0 300 0 
                 Z" 
              fill="url(#limeGreen)" 
              className="animate-drip" 
              style={{ transform: 'rotate(1.3deg)' }}/>
      </svg>
    </div>
  )
}
