import React, { useState, useMemo } from 'react';
import { CornerFlourishes, AmbientBackgroundFlourishes } from './LeafFlourish';
import { generatePixelFlower } from '../village/pixelFlowers.js';

/** -------------------------------------------------------------
 *  BOUQUET OPTIONS DATA (NO EMOJI - ALL CUSTOM SVG ILLUSTRATIONS)
 * ------------------------------------------------------------- */
export const FLOWER_TYPES = [
  { id: 'daisy', name: 'Daisy', color: '#ffffff', centerColor: '#ffb703', petalCount: 8, petalColor: '#ffffff' },
  { id: 'tulip', name: 'Tulip', color: '#ff4d6d', centerColor: '#c9184a', petalCount: 6, petalColor: '#ff4d6d' },
  { id: 'rose', name: 'Rose', color: '#e63946', centerColor: '#9b2226', petalCount: 10, petalColor: '#e63946' },
  { id: 'poppy', name: 'Poppy', color: '#ff5400', centerColor: '#3a0ca3', petalCount: 5, petalColor: '#ff5400' },
  { id: 'lily', name: 'Lily', color: '#ffb703', centerColor: '#fb8500', petalCount: 6, petalColor: '#ffb703' },
  { id: 'sunflower', name: 'Sunflower', color: '#ffb703', centerColor: '#5c381e', petalCount: 12, petalColor: '#ffb703' },
  { id: 'lavender', name: 'Lavender', color: '#9d4edd', centerColor: '#5a189a', petalCount: 7, petalColor: '#9d4edd' },
  { id: 'cherry_blossom', name: 'Cherry Blossom', color: '#ffb5a7', centerColor: '#f8ad9d', petalCount: 5, petalColor: '#ffb5a7' },
];

export const GREENERY_TYPES = [
  { id: 'eucalyptus', name: 'Eucalyptus', color: '#70e000', leafShape: 'round' },
  { id: 'fern', name: 'Fern', color: '#38b000', leafShape: 'feather' },
  { id: 'babys_breath', name: 'Baby\'s Breath', color: '#f8f9fa', leafShape: 'dots' },
  { id: 'ivy', name: 'Ivy Leaf', color: '#137547', leafShape: 'star' },
];

export const WRAP_STYLES = [
  { id: 'kraft_paper', name: 'Kraft Paper', color: '#d4a373' },
  { id: 'pastel_pink', name: 'Pastel Pink', color: '#ffcad4' },
  { id: 'sage_green', name: 'Sage Green', color: '#b7b7a4' },
  { id: 'newspaper', name: 'Vintage News', color: '#f4f1de' },
];

export const RIBBON_STYLES = [
  { id: 'silk_ribbon', name: 'Silk Ribbon', color: '#e63946' },
  { id: 'twine', name: 'Jute Twine', color: '#a3b18a' },
  { id: 'satin_bow', name: 'Satin Bow', color: '#ffb703' },
];

export const CARD_STYLES = [
  { id: 'parchment', name: 'Warm Parchment', color: '#fffcf2' },
  { id: 'botanical', name: 'Botanical Frame', color: '#e8f5e9' },
  { id: 'gold_foil', name: 'Golden Foil', color: '#fff8e1' },
  { id: 'vintage_stamp', name: 'Vintage Stamp', color: '#fbe9e7' },
];

export const BACKGROUND_STYLES = [
  { id: 'cottage_table', name: 'Cottage Table', color: '#f4e9d8' },
  { id: 'sunny_meadow', name: 'Sunny Meadow', color: '#e8f5e9' },
  { id: 'wooden_desk', name: 'Wooden Desk', color: '#e0c9a6' },
  { id: 'night_sky', name: 'Night Sky', color: '#1a0b2e' },
];

/** -------------------------------------------------------------
 *  2D ILLUSTRATED FLOWER ASSETS (HAND-DRAWN ART STYLE)
 * ------------------------------------------------------------- */

function IllustratedDaisy({ fx, fy, scale = 1, rotation = 0 }) {
  const numPetals = 12;
  const angleStep = 360 / numPetals;

  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {/* 12 Hand-Drawn Petal Paths with 1.5px Drawn Outline */}
      {Array.from({ length: numPetals }).map((_, i) => {
        const angle = (i * angleStep * Math.PI) / 180;
        const px = Math.cos(angle) * 16;
        const py = Math.sin(angle) * 16;
        return (
          <g key={i} transform={`rotate(${i * angleStep}, ${px * 0.7}, ${py * 0.7})`}>
            <path
              d={`M 0 0 C -4.5 -10 -4.5 -22 0 -25 C 4.5 -22 4.5 -10 0 0`}
              fill="url(#illDaisyPetal)"
              stroke="#6c584c"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* Soft Petal Center Crease Line */}
            <line x1="0" y1="-4" x2="0" y2="-18" stroke="#d4a373" strokeWidth="0.8" opacity="0.5" />
          </g>
        );
      })}
      {/* Center Disc with Dot Texture & Outline */}
      <circle cx="0" cy="0" r="9" fill="url(#illDaisyCenter)" stroke="#5c381e" strokeWidth="1.4" />
      <circle cx="-3" cy="-3" r="3" fill="#ffffff" opacity="0.4" />
      <circle cx="3" cy="2" r="1" fill="#7a5c3e" opacity="0.6" />
      <circle cx="-2" cy="4" r="0.8" fill="#7a5c3e" opacity="0.6" />
      <circle cx="4" cy="-2" r="0.8" fill="#7a5c3e" opacity="0.6" />
    </g>
  );
}

function IllustratedTulip({ fx, fy, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {/* Goblet Silhouette Overlapping Cup Petal Paths */}
      <path d="M -16 14 C -26 -8 -16 -32 0 -36 C 16 -32 26 -8 16 14 Z" fill="url(#illTulipOuter)" stroke="#590d22" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M -18 8 C -22 -14 -10 -28 0 -30 C 10 -28 22 -14 18 8 Z" fill="url(#illTulipMid)" stroke="#590d22" strokeWidth="1.2" />
      <path d="M -10 4 C -12 -12 0 -22 0 -22 C 0 -22 12 -12 10 4 Z" fill="url(#illTulipInner)" stroke="#800f2f" strokeWidth="1" />
      {/* Highlight Curved Fold Edge */}
      <path d="M -14 -10 Q 0 -28 14 -10" fill="none" stroke="#ff8fa3" strokeWidth="1.2" opacity="0.6" />
    </g>
  );
}

function IllustratedRose({ fx, fy, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {/* Layered Spiral Petal Paths */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = i * 36;
        const rad = (angle * Math.PI) / 180;
        const rx = Math.cos(rad) * 15;
        const ry = Math.sin(rad) * 15;
        return (
          <path
            key={`r-out-${i}`}
            d={`M ${rx} ${ry} C ${rx * 1.5} ${ry * 1.5 - 6} ${rx * 1.3} ${ry * 1.3 + 8} ${rx * 0.4} ${ry * 0.4}`}
            fill="url(#illRoseOuter)"
            stroke="#590d22"
            strokeWidth="1.2"
          />
        );
      })}
      {Array.from({ length: 7 }).map((_, i) => {
        const angle = i * 51 + 20;
        const rad = (angle * Math.PI) / 180;
        const rx = Math.cos(rad) * 9;
        const ry = Math.sin(rad) * 9;
        return (
          <path
            key={`r-mid-${i}`}
            d={`M ${rx} ${ry} C ${rx * 1.4} ${ry * 1.4 - 4} ${rx * 1.2} ${ry * 1.2 + 5} ${rx * 0.3} ${ry * 0.3}`}
            fill="url(#illRoseMid)"
            stroke="#800f2f"
            strokeWidth="1"
          />
        );
      })}
      {/* Spiral Bud Center */}
      <path d="M -5 -2 C -8 -8 4 -10 6 -3 C 8 4 -4 8 -5 -2 Z" fill="#ff758f" stroke="#590d22" strokeWidth="1" />
      <circle cx="0" cy="0" r="3" fill="#590d22" />
    </g>
  );
}

function IllustratedPoppy({ fx, fy, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {/* Papery Petal Paths with Wavy Edges */}
      {[0, 72, 144, 216, 288].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const px = Math.cos(rad) * 14;
        const py = Math.sin(rad) * 14;
        return (
          <path
            key={i}
            d={`M 0 0 C ${px * 1.8} ${py * 1.8 - 10} ${px * 2.1} ${py * 2.1 + 8} 0 0`}
            fill="url(#illPoppyPetal)"
            stroke="#4a1a0e"
            strokeWidth="1.3"
          />
        );
      })}
      {/* Radiating Stamens & Dark Center */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const sx = Math.cos(rad) * 10;
        const sy = Math.sin(rad) * 10;
        return <line key={i} x1="0" y1="0" x2={sx} y2={sy} stroke="#2b001e" strokeWidth="1.4" />;
      })}
      <circle cx="0" cy="0" r="6" fill="#1a1a1a" stroke="#2b001e" strokeWidth="1.2" />
      <circle cx="-2" cy="-2" r="2" fill="#ffffff" opacity="0.35" />
    </g>
  );
}

function IllustratedLily({ fx, fy, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {/* 6 Pointed Petal Paths */}
      {[60, 180, 300].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const px = Math.cos(rad) * 24;
        const py = Math.sin(rad) * 24;
        return (
          <path key={`b-${i}`} d={`M 0 0 Q ${px * 0.5} ${py * 0.5 - 7} ${px} ${py} Q ${px * 0.5} ${py * 0.5 + 7} 0 0`} fill="url(#illLilyB)" stroke="#5c381e" strokeWidth="1.2" />
        );
      })}
      {[0, 120, 240].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const px = Math.cos(rad) * 28;
        const py = Math.sin(rad) * 28;
        return (
          <path key={`a-${i}`} d={`M 0 0 Q ${px * 0.5} ${py * 0.5 - 8} ${px} ${py} Q ${px * 0.5} ${py * 0.5 + 8} 0 0`} fill="url(#illLilyA)" stroke="#5c381e" strokeWidth="1.4" />
        );
      })}
      {/* Stamens */}
      {[0, 60, 120, 180, 240, 300].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const sx = Math.cos(rad) * 14;
        const sy = Math.sin(rad) * 14;
        return (
          <g key={`st-${i}`}>
            <line x1="0" y1="0" x2={sx} y2={sy} stroke="#ffe5ec" strokeWidth="1.6" />
            <circle cx={sx} cy={sy} r="2.4" fill="#4a2c11" />
          </g>
        );
      })}
    </g>
  );
}

function IllustratedSunflower({ fx, fy, scale = 1, rotation = 0 }) {
  const numPetals = 22;
  const angleStep = 360 / numPetals;

  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {Array.from({ length: numPetals }).map((_, i) => {
        const angle = (i * angleStep * Math.PI) / 180;
        const px = Math.cos(angle) * 20;
        const py = Math.sin(angle) * 20;
        return (
          <path
            key={i}
            d={`M 0 0 Q ${px * 0.6} ${py * 0.6 - 4} ${px} ${py} Q ${px * 0.6} ${py * 0.6 + 4} 0 0`}
            fill="url(#illSunPetal)"
            stroke="#7a5c3e"
            strokeWidth="1"
          />
        );
      })}
      {/* Large Brown Center Disc with Dot Texture */}
      <circle cx="0" cy="0" r={14.5} fill="url(#illSunCenter)" stroke="#3d2616" strokeWidth="1.5" />
      <circle cx="0" cy="0" r={11} fill="#8c5a3c" opacity="0.5" />
      {/* Spiral Seed Dots */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const sx = Math.cos(rad) * 6;
        const sy = Math.sin(rad) * 6;
        return <circle key={i} cx={sx} cy={sy} r="1.2" fill="#2b180d" />;
      })}
    </g>
  );
}

function IllustratedLavender({ fx, fy, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      <path d="M 0 30 Q 2 0 0 -30" fill="none" stroke="#2d6a4f" strokeWidth="3" strokeLinecap="round" />
      {Array.from({ length: 15 }).map((_, j) => {
        const y = 18 - j * 3.5;
        const offsetX = (j % 2 === 0 ? 1 : -1) * 6;
        return (
          <g key={j} transform={`translate(${offsetX}, ${y})`}>
            <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="url(#illLavenderFloret)" stroke="#3c096c" strokeWidth="0.9" />
            <circle cx="-1.5" cy="-1" r="2" fill="#e0aaff" />
          </g>
        );
      })}
    </g>
  );
}

function IllustratedCherryBlossom({ fx, fy, scale = 1, rotation = 0 }) {
  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale})`} filter="url(#dropShadow2D)">
      {[0, 72, 144, 216, 288].map((ang, i) => {
        return (
          <g key={i} transform={`rotate(${ang})`}>
            {/* Notched Petal Path */}
            <path
              d="M 0 0 C -9 -14 -14 -24 -4 -26 C 0 -24 4 -24 4 -26 C 14 -24 9 -14 0 0"
              fill="url(#illCherryPetal)"
              stroke="#b7094c"
              strokeWidth="1.1"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((ang, i) => {
        const rad = (ang * Math.PI) / 180;
        const sx = Math.cos(rad) * 8;
        const sy = Math.sin(rad) * 8;
        return (
          <g key={i}>
            <line x1="0" y1="0" x2={sx} y2={sy} stroke="#f8ad9d" strokeWidth="1.2" />
            <circle cx={sx} cy={sy} r="1.4" fill="#e63946" />
          </g>
        );
      })}
      <circle cx="0" cy="0" r="3.5" fill="#f8ad9d" stroke="#b7094c" strokeWidth="1" />
    </g>
  );
}

export class BouquetErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error("BouquetErrorBoundary caught error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '1.5rem', background: '#fffaf1', borderRadius: 16, border: '2px solid #e07a5f', textAlign: 'center', margin: '1rem 0' }}>
          <h4 style={{ color: '#5c381e', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>🌸 Snail Mail Bouquet</h4>
          <p style={{ color: '#7a5c3e', fontSize: '0.85rem', marginBottom: '1rem' }}>
            Unable to load bouquet
          </p>
          <button
            type="button"
            style={{ padding: '0.55rem 1.1rem', borderRadius: 8, background: '#e07a5f', color: '#ffffff', border: 'none', cursor: 'pointer', fontWeight: 700 }}
            onClick={() => this.setState({ hasError: false })}
          >
            Back to Letter
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export function RenderPixelFlowerSVG({ type = 'daisy', seed = 12345, fx = 0, fy = 0, scale = 1, rotation = 0 }) {
  const flowerType = typeof type === 'string'
    ? type
    : (type && typeof type === 'object' && type.id)
      ? String(type.id)
      : 'daisy';

  const pixelMap = useMemo(() => generatePixelFlower(flowerType, seed), [flowerType, seed]);
  const pixels = pixelMap?.pixels || {};

  return (
    <g transform={`translate(${fx}, ${fy}) rotate(${rotation}) scale(${scale * 2.3})`}>
      {Object.entries(pixels).map(([coord, color]) => {
        const [px, py] = coord.split(',').map(Number);
        if (isNaN(px) || isNaN(py) || px < 0 || px >= 17 || py < 0 || py >= 17 || !color) return null;
        return (
          <rect
            key={coord}
            x={px - 8}
            y={py - 8}
            width="1.05"
            height="1.05"
            fill={color}
            shapeRendering="crispEdges"
          />
        );
      })}
    </g>
  );
}

function RenderSingleFlowerSVG({ type, seed = 12345, fx, fy, scale = 1, rotation = 0 }) {
  return <RenderPixelFlowerSVG type={type} seed={seed} fx={fx} fy={fy} scale={scale} rotation={rotation} />;
}

/** -------------------------------------------------------------
 *  SHARED BOUQUET ILLUSTRATION COMPONENT (TRUE PIXEL-ART FLOWERS)
 * ------------------------------------------------------------- */
export function RenderBouquetSVG(props) {
  return (
    <BouquetErrorBoundary>
      <RenderBouquetSVGInner {...props} />
    </BouquetErrorBoundary>
  );
}

function RenderBouquetSVGInner({ bouquet, isNight: isNightProp = false, width = 280, height = 360 }) {
  let bouquetData = bouquet;
  const isNightMode = bouquetData?.isNight ?? isNightProp;

  // SAFE FALLBACK: If bouquet data is empty, null, or has no flowers, generate default bouquet
  if (!bouquetData || !bouquetData.flowers || bouquetData.flowers.length === 0) {
    bouquetData = generateDefaultBouquet(isNightMode);
  }

  const selectedFlowers = bouquetData.flowers || [];
  const selectedGreenery = bouquetData.greenery || [GREENERY_TYPES[0]];
  const wrap = bouquetData.wrap || WRAP_STYLES[0];
  const ribbon = bouquetData.ribbon || RIBBON_STYLES[0];
  const card = bouquetData.card || CARD_STYLES[0];
  const bg = bouquetData.background || BACKGROUND_STYLES[0];

  const viewH = isNightMode ? 380 : 350;
  const bgColor = isNightMode ? '#10061e' : bg.color || '#f4e9d8';
  const wrapColor = isNightMode ? '#3a0ca3' : wrap.color || '#d4a373';
  const ribbonColor = isNightMode ? '#7209b7' : ribbon.color || '#e63946';

  // Anchor Bundle Point & Stem Convergence (140, 310)
  const CX = 140;
  const TY = 35;
  const BY = 310;
  const H = 275;
  const W = 105;

  return (
    <svg width={width} height={height} viewBox={`0 0 280 ${viewH}`} style={{ background: bgColor, borderRadius: 16, imageRendering: 'pixelated' }}>
      <defs>
        {/* Soft 2D Drop Shadow Filter for Paper-Doll Layering */}
        <filter id="dropShadow2D" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.5" dy="2.5" stdDeviation="2.2" floodColor="#2b2013" floodOpacity="0.32" />
        </filter>

        {/* Paper Wrap Cone Facet Gradients */}
        <linearGradient id="illWrapLeft" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={wrapColor} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>

        <linearGradient id="illWrapRight" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor={wrapColor} />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.22" />
        </linearGradient>
      </defs>

      {/* 1. Background Card Backdrop */}
      <rect width="280" height={viewH} rx="16" fill={bgColor} />
      <circle cx="140" cy="140" r="115" fill={isNightMode ? '#3a0ca3' : '#ffffff'} opacity="0.18" />

      {/* Night Mode Subtle Pixel-Art Particles & Glow */}
      {isNightMode && (
        <g opacity="0.75">
          <rect x="40" y="35" width="4" height="4" fill="#ffd166" shapeRendering="crispEdges" />
          <rect x="230" y="50" width="4" height="4" fill="#c77dff" shapeRendering="crispEdges" />
          <rect x="65" y="110" width="3" height="3" fill="#e0aaff" shapeRendering="crispEdges" />
          <rect x="215" y="125" width="4" height="4" fill="#ffd166" shapeRendering="crispEdges" />
          <rect x="180" y="30" width="3" height="3" fill="#ffffff" shapeRendering="crispEdges" />
          <circle cx="140" cy="120" r="85" fill="#7209b7" opacity="0.16" />
        </g>
      )}

      {/* 2. Paper Wrap Back Flap */}
      <path d="M 65 170 Q 140 155 215 170 L 155 315 L 125 315 Z" fill="#e9d8a6" opacity="0.5" />

      {/* 3. Greenery Fan & Connecting Stems (EVERY STEM CONNECTS TO CONVERGENCE POINT CX, BY) */}
      {selectedGreenery.map((g, idx) => {
        const angle = -50 + (idx * 28);
        const rad = (angle * Math.PI) / 180;
        const gx = CX + Math.cos(rad) * 75;
        const gy = BY - 140 + Math.sin(rad) * 40;

        return (
          <g key={`g-${idx}`} filter="url(#dropShadow2D)">
            {/* Greenery Stem Connecting Head to Bottom Convergence */}
            <path d={`M ${gx} ${gy} Q ${gx * 0.5 + CX * 0.5} ${gy * 0.4 + BY * 0.6} ${CX} ${BY}`} stroke="#1c5200" strokeWidth="2.5" strokeLinecap="round" />
            {/* Leaf Fan Head */}
            <g transform={`translate(${gx}, ${gy}) rotate(${angle})`}>
              <path d="M 0 0 Q -18 -38 0 -68 Q 18 -38 0 0" fill={g.color || '#38b000'} stroke="#1c5200" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="0" y2="-62" stroke="#ffffff" strokeWidth="1" opacity="0.4" />
            </g>
          </g>
        );
      })}

      {/* 4. Bundled Flower Stems (EVERY STEM GRADUALLY CONVERGES TOWARD X=0, Y=0.95-1.00) */}
      {selectedFlowers.map((f, idx) => {
        const total = selectedFlowers.length;

        // Normalized coordinate resolution
        let xNorm = f.xNorm;
        let yNorm = f.yNorm;
        let scale = f.scale || 1.0;

        if (xNorm == null || yNorm == null) {
          const ratio = idx / Math.max(1, total - 1);
          const fanAngle = (ratio - 0.5) * 1.3;
          xNorm = Math.sin(fanAngle) * 0.65;
          yNorm = 0.15 + Math.cos(fanAngle) * 0.35;
          scale = idx % 2 === 0 ? 1.2 : 0.85;
        }

        const fx = CX + xNorm * W;
        const fy = TY + yNorm * H;

        return (
          <path
            key={`stem-${idx}`}
            d={`M ${fx} ${fy} Q ${fx * 0.45 + CX * 0.55} ${fy * 0.35 + BY * 0.65} ${CX} ${BY}`}
            stroke="#2d6a4f"
            strokeWidth={scale > 1.1 ? '3.5' : '2.5'}
            strokeLinecap="round"
          />
        );
      })}

      {/* 5. Layered Flower Heads (Back Flowers First, Front Flowers Last) */}
      {selectedFlowers.map((f, idx) => {
        const total = selectedFlowers.length;

        let xNorm = f.xNorm;
        let yNorm = f.yNorm;
        let scale = f.scale || 1.0;
        let rotation = f.rotation || 0;

        if (xNorm == null || yNorm == null) {
          const ratio = idx / Math.max(1, total - 1);
          const fanAngle = (ratio - 0.5) * 1.3;
          xNorm = Math.sin(fanAngle) * 0.65;
          yNorm = 0.15 + Math.cos(fanAngle) * 0.35;
          scale = idx % 2 === 0 ? 1.2 : 0.85;
          rotation = (idx % 3 === 0 ? -10 : idx % 3 === 1 ? 12 : -5);
        }

        const fx = CX + xNorm * W;
        const fy = TY + yNorm * H;

        return (
          <g key={`fl-${idx}-${f.id || idx}`}>
            <RenderSingleFlowerSVG type={f.type || 'daisy'} seed={f.seed || idx * 100} fx={fx} fy={fy} scale={scale} rotation={rotation} />
          </g>
        );
      })}

      {/* 6. Paper Wrap Front Cone with Fold Lines & Soft Shadow */}
      <g filter="url(#dropShadow2D)">
        <polygon points="75,185 205,185 155,315 125,315" fill={wrapColor} stroke="#5c381e" strokeWidth="1.8" strokeLinejoin="round" />
        <polygon points="75,185 140,230 125,315" fill="url(#illWrapLeft)" />
        <polygon points="205,185 140,230 155,315" fill="url(#illWrapRight)" />
        <line x1="75" y1="185" x2="140" y2="230" stroke="#5c381e" strokeWidth="1.2" opacity="0.7" />
        <line x1="205" y1="185" x2="140" y2="230" stroke="#5c381e" strokeWidth="1.2" opacity="0.7" />
        <line x1="75" y1="185" x2="205" y2="185" stroke="#ffffff" strokeWidth="1.4" opacity="0.4" />
      </g>

      {/* 7. Ribbon & Bow Wrapped Around Bundle Point (140, 230) */}
      <g transform={`translate(${CX}, 230)`} filter="url(#dropShadow2D)">
        <path d="M -6 4 Q -16 28 -22 45" fill="none" stroke={ribbonColor} strokeWidth="6" strokeLinecap="round" />
        <path d="M 6 4 Q 16 28 22 45" fill="none" stroke={ribbonColor} strokeWidth="6" strokeLinecap="round" />
        <ellipse cx="0" cy="0" rx="28" ry="7.5" fill={ribbonColor} stroke="#2b2013" strokeWidth="1" />
        <path d="M 0 0 C -26 -22 -32 12 0 0" fill={ribbonColor} stroke="#2b2013" strokeWidth="1.2" />
        <path d="M 0 0 C 26 -22 32 12 0 0" fill={ribbonColor} stroke="#2b2013" strokeWidth="1.2" />
        <ellipse cx="0" cy="-2" rx="20" ry="2.5" fill="#ffffff" opacity="0.35" />
        <circle cx="0" cy="0" r="5.5" fill="#ffffff" stroke="#2b2013" strokeWidth="1" />
      </g>

      {/* 8. Attached Note Card Tucked inside Wrap (12° Angle) */}
      {card && (
        <g transform="translate(165, 240) rotate(12)" filter="url(#dropShadow2D)">
          <rect width="46" height="32" rx="4" fill={card.color || '#fffcf2'} stroke="#5c381e" strokeWidth="1.5" />
          <line x1="6" y1="10" x2="40" y2="10" stroke="#7a5c3e" strokeWidth="1" />
          <line x1="6" y1="18" x2="30" y2="18" stroke="#7a5c3e" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}

export default function BouquetBuilder(props) {
  return (
    <BouquetErrorBoundary>
      <BouquetBuilderInner {...props} />
    </BouquetErrorBoundary>
  );
}

function BouquetBuilderInner({ isNight = false, onDone, onCancel }) {
  const [activeStep, setActiveStep] = useState(0); // 0: Flowers, 1: Greenery, 2: Wrap, 3: Card, 4: Background, 5: Preview
  const defaultBouquet = useMemo(() => generateDefaultBouquet(isNight), [isNight]);

  const [selectedFlowers, setSelectedFlowers] = useState([
    { id: 'f-1', type: 'rose' },
    { id: 'f-2', type: 'sunflower' },
    { id: 'f-3', type: 'tulip' },
    { id: 'f-4', type: 'daisy' },
    { id: 'f-5', type: 'lavender' },
  ]);
  const [selectedGreenery, setSelectedGreenery] = useState([GREENERY_TYPES[0]]);
  const [selectedWrap, setSelectedWrap] = useState(WRAP_STYLES[0]);
  const [selectedRibbon, setSelectedRibbon] = useState(RIBBON_STYLES[0]);
  const [selectedCard, setSelectedCard] = useState(CARD_STYLES[0]);
  const [selectedBg, setSelectedBg] = useState(BACKGROUND_STYLES[0]);

  const steps = [
    { title: 'Flowers', icon: '🌸' },
    { title: 'Greenery', icon: '🌿' },
    { title: 'Wrap & Ribbon', icon: '🎀' },
    { title: 'Card', icon: '📜' },
    { title: 'Background', icon: '🖼️' },
    { title: 'Preview', icon: '👁️' },
  ];

  const handleAddFlower = (flowerType) => {
    if (selectedFlowers.length >= 8) return;
    const newFlower = { id: `fl-${Date.now()}-${Math.random()}`, type: flowerType.id };
    setSelectedFlowers((prev) => [...prev, newFlower]);
  };

  const handleRemoveFlower = (id) => {
    if (selectedFlowers.length <= 3) return; // Keep min 3
    setSelectedFlowers((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAll = () => {
    setSelectedFlowers([
      { id: 'f-1', type: 'rose' },
      { id: 'f-2', type: 'sunflower' },
      { id: 'f-3', type: 'tulip' },
      { id: 'f-4', type: 'daisy' },
      { id: 'f-5', type: 'lavender' },
    ]);
    setSelectedGreenery([GREENERY_TYPES[0]]);
    setSelectedWrap(WRAP_STYLES[0]);
    setSelectedRibbon(RIBBON_STYLES[0]);
    setSelectedCard(CARD_STYLES[0]);
    setSelectedBg(BACKGROUND_STYLES[0]);
  };

  const currentBouquetData = {
    flowers: selectedFlowers.length > 0 ? selectedFlowers : defaultBouquet.flowers,
    greenery: selectedGreenery,
    wrap: selectedWrap,
    ribbon: selectedRibbon,
    card: selectedCard,
    background: selectedBg,
    isNight,
  };

  const isValidFlowers = selectedFlowers.length >= 3 && selectedFlowers.length <= 8;

  return (
    <div style={{ ...styles.container, position: 'relative' }}>
      <AmbientBackgroundFlourishes />
      <CornerFlourishes variantLeft={1} variantRight={2} size={44} offset={8} />

      {/* Header */}
      <div style={{ ...styles.header, position: 'relative', zIndex: 3 }}>
        <h2 style={styles.title}>Custom Bouquet Builder</h2>
        <button style={styles.closeBtn} onClick={onCancel}>✕</button>
      </div>

      <div style={styles.mainLayout}>
        {/* Left Sidebar Steps */}
        <div style={styles.sidebar}>
          {steps.map((step, idx) => (
            <button
              key={step.title}
              style={{
                ...styles.tabBtn,
                background: activeStep === idx ? '#fffaf1' : 'transparent',
                borderColor: activeStep === idx ? '#e07a5f' : 'transparent',
                color: activeStep === idx ? '#5c381e' : '#8a7a63',
                fontWeight: activeStep === idx ? 800 : 600,
              }}
              onClick={() => setActiveStep(idx)}
            >
              <span style={styles.tabIcon}>{step.icon}</span>
              <span>{step.title}</span>
            </button>
          ))}
        </div>

        {/* Middle Step Selection Content */}
        <div style={styles.stepContent}>
          {activeStep === 0 && (
            <div>
              <h3 style={styles.stepTitle}>Choose Flowers (3 to 8 required)</h3>
              <p style={styles.stepSub}>Select vibrant blooms to arrange in your custom bouquet.</p>

              <div style={styles.grid}>
                {FLOWER_TYPES.map((ft) => (
                  <button
                    key={ft.id}
                    style={styles.cardBtn}
                    onClick={() => handleAddFlower(ft)}
                    disabled={selectedFlowers.length >= 8}
                  >
                    <svg width="46" height="46" viewBox="0 0 40 40">
                      <RenderSingleFlowerSVG type={ft.id} fx={20} fy={20} scale={0.65} />
                    </svg>
                    <div style={styles.cardName}>{ft.name}</div>
                  </button>
                ))}
              </div>

              {/* Selected Tray */}
              <div style={styles.trayContainer}>
                <div style={styles.trayHeader}>
                  <span>Selected Flowers ({selectedFlowers.length}/8)</span>
                  {selectedFlowers.length < 3 && <span style={{ color: '#e63946' }}>*Minimum 3 required</span>}
                </div>
                <div style={styles.trayList}>
                  {selectedFlowers.map((f, index) => {
                    const fl = FLOWER_TYPES.find((ft) => ft.id === f.type);
                    return (
                      <div key={f.id} style={styles.trayChip}>
                        <span>{fl?.name || 'Flower'} #{index + 1}</span>
                        {selectedFlowers.length > 3 && (
                          <button style={styles.removeChipBtn} onClick={() => handleRemoveFlower(f.id)}>✕</button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeStep === 1 && (
            <div>
              <h3 style={styles.stepTitle}>Add Greenery & Foliage</h3>
              <p style={styles.stepSub}>Select leaves and stems to frame your flowers.</p>
              <div style={styles.grid}>
                {GREENERY_TYPES.map((gt) => {
                  const isSel = selectedGreenery.some((g) => g.id === gt.id);
                  return (
                    <button
                      key={gt.id}
                      style={{
                        ...styles.cardBtn,
                        borderColor: isSel ? '#e07a5f' : '#e3d7bf',
                        background: isSel ? '#fdf0ed' : '#ffffff',
                      }}
                      onClick={() => {
                        if (isSel) {
                          setSelectedGreenery((prev) => prev.filter((g) => g.id !== gt.id));
                        } else {
                          setSelectedGreenery((prev) => [...prev, gt]);
                        }
                      }}
                    >
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="16" fill={gt.color} opacity="0.85" />
                        <path d="M20 8 Q 10 20 20 32 Q 30 20 20 8" fill="none" stroke="#ffffff" strokeWidth="2" />
                      </svg>
                      <div style={styles.cardName}>{gt.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div>
              <h3 style={styles.stepTitle}>Paper Wrap & Ribbon</h3>
              <p style={styles.stepSub}>Choose cozy paper wrapping and decorative ribbon.</p>
              <div style={styles.subSectionTitle}>Paper Wrap</div>
              <div style={styles.grid}>
                {WRAP_STYLES.map((ws) => (
                  <button
                    key={ws.id}
                    style={{
                      ...styles.cardBtn,
                      borderColor: selectedWrap.id === ws.id ? '#e07a5f' : '#e3d7bf',
                      background: selectedWrap.id === ws.id ? '#fdf0ed' : '#ffffff',
                    }}
                    onClick={() => setSelectedWrap(ws)}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: ws.color, border: '1px solid #5c381e' }} />
                    <div style={styles.cardName}>{ws.name}</div>
                  </button>
                ))}
              </div>

              <div style={{ ...styles.subSectionTitle, marginTop: 16 }}>Ribbon</div>
              <div style={styles.grid}>
                {RIBBON_STYLES.map((rs) => (
                  <button
                    key={rs.id}
                    style={{
                      ...styles.cardBtn,
                      borderColor: selectedRibbon.id === rs.id ? '#e07a5f' : '#e3d7bf',
                      background: selectedRibbon.id === rs.id ? '#fdf0ed' : '#ffffff',
                    }}
                    onClick={() => setSelectedRibbon(rs)}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: rs.color, border: '1px solid #5c381e' }} />
                    <div style={styles.cardName}>{rs.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div>
              <h3 style={styles.stepTitle}>Attached Note Card</h3>
              <p style={styles.stepSub}>Choose a gift card style to attach to the bouquet ribbon.</p>
              <div style={styles.grid}>
                {CARD_STYLES.map((cs) => (
                  <button
                    key={cs.id}
                    style={{
                      ...styles.cardBtn,
                      borderColor: selectedCard.id === cs.id ? '#e07a5f' : '#e3d7bf',
                      background: selectedCard.id === cs.id ? '#fdf0ed' : '#ffffff',
                    }}
                    onClick={() => setSelectedCard(cs)}
                  >
                    <div style={{ width: 44, height: 32, borderRadius: 6, background: cs.color, border: '1.5px solid #5c381e' }} />
                    <div style={styles.cardName}>{cs.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div>
              <h3 style={styles.stepTitle}>Backdrop Scene</h3>
              <p style={styles.stepSub}>Choose a background backdrop for your bouquet preview.</p>
              <div style={styles.grid}>
                {BACKGROUND_STYLES.map((bs) => (
                  <button
                    key={bs.id}
                    style={{
                      ...styles.cardBtn,
                      borderColor: selectedBg.id === bs.id ? '#e07a5f' : '#e3d7bf',
                      background: selectedBg.id === bs.id ? '#fdf0ed' : '#ffffff',
                    }}
                    onClick={() => setSelectedBg(bs)}
                  >
                    <div style={{ width: 44, height: 32, borderRadius: 8, background: bs.color, border: '1.5px solid #5c381e' }} />
                    <div style={styles.cardName}>{bs.name}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div>
              <h3 style={styles.stepTitle}>Bouquet Ready!</h3>
              <p style={styles.stepSub}>Your custom bouquet is composed and ready to attach to your letter.</p>
              <div style={styles.summaryBox}>
                <div><strong>Flowers:</strong> {selectedFlowers.length} blooms selected</div>
                <div><strong>Greenery:</strong> {selectedGreenery.map((g) => g.name).join(', ') || 'None'}</div>
                <div><strong>Wrap:</strong> {selectedWrap.name}</div>
                <div><strong>Ribbon:</strong> {selectedRibbon.name}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Live Bouquet Preview Panel */}
        <div style={styles.previewPanel}>
          <div style={styles.previewTitle}>Your Bouquet Preview</div>
          <RenderBouquetSVG bouquet={currentBouquetData} width={260} height={280} />

          <div style={styles.actionRow}>
            <button style={styles.clearBtn} onClick={handleClearAll}>Clear All</button>
            {activeStep < 5 ? (
              <button
                style={{
                  ...styles.nextBtn,
                  opacity: !isValidFlowers ? 0.5 : 1,
                }}
                disabled={!isValidFlowers}
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                Next Step →
              </button>
            ) : (
              <button
                style={styles.doneBtn}
                onClick={() => onDone(currentBouquetData)}
              >
                Attach & Return to Letter
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: '#fffaf1',
    borderRadius: 20,
    padding: '1.25rem',
    border: '2px solid #e3d7bf',
    fontFamily: "'Quicksand', 'Outfit', 'Nunito', system-ui, sans-serif",
    color: '#5c381e',
    maxWidth: 780,
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: '0.8rem',
    borderBottom: '1.5px solid #e8dfce',
  },
  title: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#4a2c11',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.2rem',
    cursor: 'pointer',
    color: '#8a7a63',
  },
  mainLayout: {
    display: 'grid',
    gridTemplateColumns: '150px 1fr 280px',
    gap: 16,
    marginTop: 14,
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    borderRight: '1.5px solid #e8dfce',
    paddingRight: 10,
  },
  tabBtn: {
    padding: '0.6rem 0.75rem',
    borderRadius: 12,
    border: '1.5px solid transparent',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    fontSize: '0.85rem',
    textAlign: 'left',
    transition: 'all 0.15s ease',
  },
  tabIcon: {
    fontSize: '1.0rem',
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  stepTitle: {
    margin: 0,
    fontSize: '1.05rem',
    fontWeight: 800,
    color: '#4a2c11',
  },
  stepSub: {
    margin: '2px 0 10px 0',
    fontSize: '0.82rem',
    color: '#7a5c3e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: 8,
  },
  cardBtn: {
    padding: '0.65rem 0.5rem',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
    background: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  cardName: {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#4a2c11',
    textAlign: 'center',
  },
  trayContainer: {
    marginTop: 14,
    padding: '0.75rem',
    background: '#ffffff',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
  },
  trayHeader: {
    fontSize: '0.8rem',
    fontWeight: 700,
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  trayList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
  },
  trayChip: {
    padding: '0.3rem 0.6rem',
    borderRadius: 999,
    background: '#fdf0ed',
    border: '1px solid #e07a5f',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: '#5c381e',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  removeChipBtn: {
    background: 'none',
    border: 'none',
    color: '#e63946',
    cursor: 'pointer',
    fontWeight: 800,
    fontSize: '0.8rem',
  },
  subSectionTitle: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#5c381e',
    marginBottom: 6,
  },
  summaryBox: {
    padding: '1rem',
    background: '#ffffff',
    borderRadius: 12,
    border: '1.5px solid #e3d7bf',
    fontSize: '0.88rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  previewPanel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
    borderLeft: '1.5px solid #e8dfce',
    paddingLeft: 12,
  },
  previewTitle: {
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#4a2c11',
  },
  actionRow: {
    display: 'flex',
    width: '100%',
    gap: 8,
    marginTop: 6,
  },
  clearBtn: {
    padding: '0.55rem 0.8rem',
    borderRadius: 10,
    border: '1.5px solid #e3d7bf',
    background: '#ffffff',
    color: '#8a7a63',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.8rem',
  },
  nextBtn: {
    flex: 1,
    padding: '0.55rem 0.8rem',
    borderRadius: 10,
    border: 'none',
    background: '#e07a5f',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
  doneBtn: {
    flex: 1,
    padding: '0.55rem 0.8rem',
    borderRadius: 10,
    border: 'none',
    background: '#38b000',
    color: '#ffffff',
    fontWeight: 800,
    cursor: 'pointer',
    fontSize: '0.82rem',
  },
};
