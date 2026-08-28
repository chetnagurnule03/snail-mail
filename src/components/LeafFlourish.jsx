import React from 'react';

/** -------------------------------------------------------------
 *  DECORATIVE LEAF FLOURISH ASSET (AMBIENT UI CORNER DECORATION)
 *  Purely decorative overlay — NOT part of the functional bouquet.
 * ------------------------------------------------------------- */

export function LeafFlourishSVG({ variant = 1, width = 48, height = 48, color = '#52b788' }) {
  return (
    <svg width={width} height={height} viewBox="0 0 50 50" style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id={`flourishGrad-${variant}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#74c69d" />
        </linearGradient>
      </defs>

      {variant === 1 && (
        <g>
          {/* Main Curved Stem */}
          <path d="M 5 45 Q 15 25 45 5" fill="none" stroke="#1b4332" strokeWidth="1.8" strokeLinecap="round" />
          {/* Alternating Pointed Leaves */}
          <path d="M 12 33 Q 5 22 18 20 Q 20 28 12 33" fill={`url(#flourishGrad-${variant})`} stroke="#1b4332" strokeWidth="1.2" />
          <path d="M 22 23 Q 32 30 30 15 Q 22 15 22 23" fill={`url(#flourishGrad-${variant})`} stroke="#1b4332" strokeWidth="1.2" />
          <path d="M 28 17 Q 20 6 35 7 Q 35 15 28 17" fill={`url(#flourishGrad-${variant})`} stroke="#1b4332" strokeWidth="1.2" />
          <path d="M 38 10 Q 48 18 45 3 Q 38 4 38 10" fill={`url(#flourishGrad-${variant})`} stroke="#1b4332" strokeWidth="1.2" />
        </g>
      )}

      {variant === 2 && (
        <g>
          {/* Branching Leaf Sprig */}
          <path d="M 45 45 Q 25 20 5 5" fill="none" stroke="#1c5200" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M 32 32 Q 42 22 28 20 Q 24 28 32 32" fill="#70e000" stroke="#1c5200" strokeWidth="1.2" />
          <path d="M 22 22 Q 12 12 14 26 Q 22 28 22 22" fill="#70e000" stroke="#1c5200" strokeWidth="1.2" />
          <path d="M 15 15 Q 25 5 10 7 Q 7 15 15 15" fill="#70e000" stroke="#1c5200" strokeWidth="1.2" />
          <path d="M 8 8 Q -2 0 2 14 Q 10 12 8 8" fill="#70e000" stroke="#1c5200" strokeWidth="1.2" />
        </g>
      )}

      {variant === 3 && (
        <g>
          {/* Delicate Corner Vine */}
          <path d="M 5 5 Q 30 15 45 45" fill="none" stroke="#2d6a4f" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M 15 9 Q 25 0 24 14 Q 16 16 15 9" fill="#52b788" stroke="#1b4332" strokeWidth="1.1" />
          <path d="M 27 15 Q 38 25 36 10 Q 28 10 27 15" fill="#52b788" stroke="#1b4332" strokeWidth="1.1" />
          <path d="M 36 28 Q 48 35 44 22 Q 35 24 36 28" fill="#52b788" stroke="#1b4332" strokeWidth="1.1" />
        </g>
      )}
    </svg>
  );
}

/** Corner Flourishes Overlay Component */
export function CornerFlourishes({ variantLeft = 1, variantRight = 2, size = 42, offset = 6, opacity = 0.85 }) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: offset,
          left: offset,
          pointerEvents: 'none',
          opacity,
          zIndex: 2,
        }}
      >
        <LeafFlourishSVG variant={variantLeft} width={size} height={size} />
      </div>

      <div
        style={{
          position: 'absolute',
          top: offset,
          right: offset,
          transform: 'scaleX(-1)',
          pointerEvents: 'none',
          opacity,
          zIndex: 2,
        }}
      >
        <LeafFlourishSVG variant={variantRight} width={size} height={size} />
      </div>
    </>
  );
}

/** Ambient Background Leaf Filler Component */
export function AmbientBackgroundFlourishes() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '8%', left: '4%', opacity: 0.35, transform: 'rotate(-25deg)' }}>
        <LeafFlourishSVG variant={1} width={60} height={60} />
      </div>
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.35, transform: 'rotate(135deg)' }}>
        <LeafFlourishSVG variant={2} width={65} height={65} />
      </div>
      <div style={{ position: 'absolute', top: '15%', right: '6%', opacity: 0.3, transform: 'rotate(45deg)' }}>
        <LeafFlourishSVG variant={3} width={55} height={55} />
      </div>
    </div>
  );
}
