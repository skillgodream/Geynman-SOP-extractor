import React from 'react';

interface KoalaCharacterProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  mood?: 'curious' | 'happy' | 'thinking' | 'teaching';
}

export const KoalaCharacter: React.FC<KoalaCharacterProps> = ({
  className = '',
  size = 'hero',
}) => {
  const [hasImageError, setHasImageError] = React.useState(false);
  const sizeMap = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
    hero: 'w-64 h-64 sm:w-80 sm:h-80',
  };

  if (!hasImageError) {
    return (
      <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none" />
        <img
          src="/assets/aistudio/Cheerful Koala Learning Mascot.png"
          alt="Cheerful Koala Learning Mascot"
          className="w-full h-full object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-105"
          onError={() => setHasImageError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      {/* Subtle Apple-style soft ambient radial glow behind the character */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent blur-2xl pointer-events-none" />

      <svg
        viewBox="0 0 320 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-2xl overflow-visible transition-transform duration-500 hover:scale-105"
      >
        <defs>
          {/* Subtle Apple gradient shading */}
          <radialGradient id="koalaEarL" cx="20%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#737373" />
            <stop offset="100%" stopColor="#404040" />
          </radialGradient>
          <radialGradient id="koalaEarInnerL" cx="30%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e5e5e5" />
            <stop offset="100%" stopColor="#a3a3a3" />
          </radialGradient>
          <radialGradient id="koalaHeadGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#737373" />
            <stop offset="45%" stopColor="#525252" />
            <stop offset="100%" stopColor="#262626" />
          </radialGradient>
          <radialGradient id="koalaNoseGrad" cx="35%" cy="25%" r="65%">
            <stop offset="0%" stopColor="#262626" />
            <stop offset="60%" stopColor="#171717" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          <linearGradient id="sweaterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1f1f1f" />
            <stop offset="100%" stopColor="#121212" />
          </linearGradient>
          <linearGradient id="glassesGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#737373" />
          </linearGradient>
        </defs>

        {/* --- BODY / SWEATER --- */}
        <g id="body">
          {/* Shoulders */}
          <path
            d="M 90 260 C 90 215, 130 205, 160 205 C 190 205, 230 215, 230 260 L 245 320 L 75 320 Z"
            fill="url(#sweaterGrad)"
            stroke="#2e2e2e"
            strokeWidth="2"
          />
          {/* Apple Turtleneck Collar */}
          <path
            d="M 125 200 C 125 192, 195 192, 195 200 C 195 210, 125 210, 125 200 Z"
            fill="#262626"
            stroke="#404040"
            strokeWidth="2"
          />
          {/* Subtle Feynman Atomic Loop on Chest */}
          <ellipse
            cx="160"
            cy="245"
            rx="16"
            ry="6"
            transform="rotate(-25 160 245)"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
          <ellipse
            cx="160"
            cy="245"
            rx="16"
            ry="6"
            transform="rotate(25 160 245)"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.4"
            strokeWidth="1.5"
          />
          <circle cx="160" cy="245" r="2.5" fill="#ffffff" fillOpacity="0.7" />
        </g>

        {/* --- LEFT EAR --- */}
        <g id="leftEar">
          <circle cx="85" cy="105" r="44" fill="url(#koalaEarL)" />
          {/* Inner fluffy ear */}
          <ellipse cx="88" cy="105" rx="26" ry="30" fill="url(#koalaEarInnerL)" />
          <path
            d="M 68 95 Q 60 105 68 115 Q 62 122 72 126"
            stroke="#e5e5e5"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- RIGHT EAR --- */}
        <g id="rightEar">
          <circle cx="235" cy="105" r="44" fill="url(#koalaEarL)" />
          {/* Inner fluffy ear */}
          <ellipse cx="232" cy="105" rx="26" ry="30" fill="url(#koalaEarInnerL)" />
          <path
            d="M 252 95 Q 260 105 252 115 Q 258 122 248 126"
            stroke="#e5e5e5"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- HEAD BASE --- */}
        <g id="head">
          {/* Main Koala Head Shape (Slightly wide, friendly cheeks) */}
          <path
            d="M 160 65 C 220 65, 245 95, 245 140 C 245 185, 215 205, 160 205 C 105 205, 75 185, 75 140 C 75 95, 100 65, 160 65 Z"
            fill="url(#koalaHeadGrad)"
          />

          {/* Cheeks soft highlights */}
          <circle cx="102" cy="155" r="12" fill="#ffffff" fillOpacity="0.06" />
          <circle cx="218" cy="155" r="12" fill="#ffffff" fillOpacity="0.06" />

          {/* Forehead subtle tuft */}
          <path
            d="M 152 68 Q 160 56 168 68 Q 160 60 152 68 Z"
            fill="#737373"
          />
        </g>

        {/* --- EYES --- */}
        <g id="eyes">
          {/* Left Eye */}
          <circle cx="120" cy="132" r="9" fill="#0f0f0f" />
          <circle cx="118" cy="130" r="3" fill="#ffffff" />
          <circle cx="123" cy="134" r="1.2" fill="#ffffff" fillOpacity="0.8" />

          {/* Right Eye */}
          <circle cx="200" cy="132" r="9" fill="#0f0f0f" />
          <circle cx="198" cy="130" r="3" fill="#ffffff" />
          <circle cx="203" cy="134" r="1.2" fill="#ffffff" fillOpacity="0.8" />

          {/* Soft friendly eyebrows */}
          <path
            d="M 110 118 Q 120 114 130 117"
            stroke="#404040"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 190 117 Q 200 114 210 118"
            stroke="#404040"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- THE ICONIC KOALA NOSE (Large rounded leathery snout) --- */}
        <g id="nose">
          <ellipse cx="160" cy="148" rx="20" ry="28" fill="url(#koalaNoseGrad)" />
          {/* Specular gloss highlight on nose */}
          <ellipse cx="156" cy="134" rx="7" ry="9" fill="#ffffff" fillOpacity="0.22" />
        </g>

        {/* --- GENTLE MOUTH --- */}
        <g id="mouth">
          <path
            d="M 152 182 Q 160 188 168 182"
            stroke="#171717"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* --- SCHOLARLY FEYNMAN WIREFRAME GLASSES --- */}
        <g id="glasses">
          {/* Left Lens Frame */}
          <circle
            cx="120"
            cy="133"
            r="19"
            stroke="url(#glassesGrad)"
            strokeWidth="2.5"
            fill="#ffffff"
            fillOpacity="0.05"
          />
          {/* Right Lens Frame */}
          <circle
            cx="200"
            cy="133"
            r="19"
            stroke="url(#glassesGrad)"
            strokeWidth="2.5"
            fill="#ffffff"
            fillOpacity="0.05"
          />
          {/* Bridge */}
          <path
            d="M 139 130 Q 160 124 181 130"
            stroke="url(#glassesGrad)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Temples extending to ears */}
          <path
            d="M 101 131 L 82 126"
            stroke="url(#glassesGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 219 131 L 238 126"
            stroke="url(#glassesGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Subtle glass reflection glare */}
          <path
            d="M 108 124 L 126 142"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
          <path
            d="M 188 124 L 206 142"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeOpacity="0.35"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};
