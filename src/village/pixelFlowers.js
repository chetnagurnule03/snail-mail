/**
 * PIXEL FLOWER GENERATION SYSTEM (17x17 Grid)
 *
 * Handcrafted mathematical pixel-art flower generators.
 * Grid: 17x17, Center: (8, 8).
 * Every flower contains: FLOWER HEAD + STEM + LEAVES.
 */

export const GRID = 17;
export const CENTER = 8;

export function makeRng(seed) {
  let a = (typeof seed === 'number' && !isNaN(seed) ? seed : 12345) >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const FLOWER_TYPES = [
  { id: 'daisy', name: 'Daisy', color: '#ffffff' },
  { id: 'rose', name: 'Rose', color: '#e63946' },
  { id: 'tulip', name: 'Tulip', color: '#ff4d6d' },
  { id: 'sunflower', name: 'Sunflower', color: '#ffb703' },
  { id: 'poppy', name: 'Poppy', color: '#ff5400' },
  { id: 'lily', name: 'Lily', color: '#ffd166' },
  { id: 'lavender', name: 'Lavender', color: '#9d4edd' },
  { id: 'wildflower', name: 'Wildflower', color: '#b8c0ff' },
];

/**
 * Generates a 17x17 pixel map for a flower type and seed.
 * Guaranteed never to crash or throw on invalid inputs.
 */
export function generatePixelFlower(typeInput = 'daisy', seedInput = 12345) {
  // Input Sanitization
  const typeStr = typeof typeInput === 'string'
    ? typeInput
    : (typeInput && typeof typeInput === 'object' && typeInput.id)
      ? String(typeInput.id)
      : 'daisy';

  const type = typeStr.toLowerCase();
  const seed = typeof seedInput === 'number' && !isNaN(seedInput) ? seedInput : 12345;
  const rng = makeRng(seed);
  const pixels = {};

  function setPixel(x, y, color) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (rx >= 0 && rx < GRID && ry >= 0 && ry < GRID) {
      pixels[`${rx},${ry}`] = color;
    }
  }

  function pickShade(palette) {
    return palette[Math.floor(rng() * palette.length)];
  }

  // Draw stem (45–60% height) and leaves (15–30% width)
  function drawStemAndLeaves(stemYStart = 8, stemWidth = 1, leafCount = 2, stemColor = '#2d6a4f', leafColor = '#38b000') {
    // Green Stem
    for (let y = stemYStart; y < GRID; y++) {
      for (let w = 0; w < stemWidth; w++) {
        setPixel(CENTER + w - Math.floor(stemWidth / 2), y, stemColor);
      }
    }

    // Leaves attached to stem
    const leafY1 = stemYStart + 2 + Math.floor(rng() * 2);
    const leafY2 = leafY1 + 3;

    // Left Leaf
    setPixel(CENTER - 1, leafY1, leafColor);
    setPixel(CENTER - 2, leafY1 - 1, leafColor);
    setPixel(CENTER - 3, leafY1 - 1, leafColor);
    setPixel(CENTER - 2, leafY1, '#1c5200'); // dark outline

    if (leafCount >= 2) {
      // Right Leaf
      setPixel(CENTER + stemWidth, leafY2, leafColor);
      setPixel(CENTER + stemWidth + 1, leafY2 - 1, leafColor);
      setPixel(CENTER + stemWidth + 2, leafY2 - 1, leafColor);
      setPixel(CENTER + stemWidth + 1, leafY2, '#1c5200'); // dark outline
    }
  }

  // Mathematical Radial Petal Helper
  function drawRadialPetals(petalCount, minR, maxR, thickness, palette, outlineColor = '#2b2013') {
    const cx = CENTER;
    const cy = 6; // bloom center near y=6 (occupies 40-55% of 17x17 grid)

    for (let i = 0; i < petalCount; i++) {
      const theta = (2 * Math.PI * i) / petalCount + (rng() * 0.15 - 0.075);
      const px = -Math.sin(theta);
      const py = Math.cos(theta);
      const col = pickShade(palette);

      for (let r = minR; r <= maxR; r++) {
        const xi = cx + r * Math.cos(theta);
        const yi = cy + r * Math.sin(theta);

        for (let w = -thickness; w <= thickness; w++) {
          const x = xi + w * px;
          const y = yi + w * py;
          setPixel(x, y, col);

          // Edge pixels get dark outline
          if (r === maxR || Math.abs(w) === thickness) {
            if (rng() > 0.6) {
              setPixel(x + Math.round(px), y + Math.round(py), outlineColor);
            }
          }
        }
      }
    }
    return { cx, cy };
  }

  try {
    switch (type) {
      case 'daisy': {
        // 8 white/cream petals, yellow center, green stem + leaves
        const { cx, cy } = drawRadialPetals(8, 2, 5, 1, ['#ffffff', '#f4f1de', '#fffcf2'], '#6c584c');
        // Yellow center core
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            setPixel(cx + dx, cy + dy, '#ffb703');
          }
        }
        setPixel(cx, cy, '#ffee8c'); // highlight
        setPixel(cx + 1, cy + 1, '#fb8500'); // dark shade
        drawStemAndLeaves(cy + 3, 1, 2, '#2d6a4f', '#38b000');
        break;
      }

      case 'poppy': {
        // 4–5 broad red/coral petals, dark center, green stem
        const { cx, cy } = drawRadialPetals(5, 2, 5, 1, ['#e63946', '#ff5400', '#d62828'], '#590d22');
        // Dark center
        setPixel(cx, cy, '#1a1a1a');
        setPixel(cx - 1, cy, '#2b001e');
        setPixel(cx + 1, cy, '#2b001e');
        setPixel(cx, cy - 1, '#2b001e');
        setPixel(cx, cy + 1, '#2b001e');
        drawStemAndLeaves(cy + 3, 1, 2, '#1c5200', '#2d6a4f');
        break;
      }

      case 'sunflower': {
        // 10–12 yellow petals, brown center, green stem, broad leaves
        const { cx, cy } = drawRadialPetals(12, 3, 6, 1, ['#ffea00', '#ffb703', '#ffd000'], '#8c5a3c');
        // Large brown center disc
        for (let dx = -2; dx <= 2; dx++) {
          for (let dy = -2; dy <= 2; dy++) {
            if (dx * dx + dy * dy <= 4) {
              setPixel(cx + dx, cy + dy, (dx === -1 && dy === -1) ? '#8c5a3c' : (dx === 1 && dy === 1) ? '#2b180d' : '#5c381e');
            }
          }
        }
        drawStemAndLeaves(cy + 3, 2, 3, '#1c5200', '#2d6a4f');
        break;
      }

      case 'lily': {
        // 6 elongated yellow/orange petals, yellow/orange center, green stem, pointed leaves
        const { cx, cy } = drawRadialPetals(6, 2, 6, 1, ['#ffd166', '#ffb703', '#ff8fa3'], '#c9184a');
        setPixel(cx, cy, '#fb8500');
        setPixel(cx - 1, cy, '#ffb703');
        setPixel(cx + 1, cy, '#ffb703');
        drawStemAndLeaves(cy + 3, 1, 2, '#2d6a4f', '#38b000');
        break;
      }

      case 'tulip': {
        // Non-radial symmetric goblet silhouette (wider upper, narrower lower)
        const cx = CENTER;
        const cy = 6;
        const mainCol = pickShade(['#ff4d6d', '#c9184a', '#e63946', '#ff758f']);
        const darkCol = '#800f2f';
        const lightCol = '#ff8fa3';

        for (let y = cy - 3; y <= cy + 3; y++) {
          const w = y <= cy ? (y - (cy - 3)) + 1 : (cy + 3 - y) + 2;
          for (let x = cx - w; x <= cx + w; x++) {
            const isEdge = x === cx - w || x === cx + w || y === cy + 3;
            setPixel(x, y, isEdge ? darkCol : (x === cx ? lightCol : mainCol));
          }
        }
        // Top uneven curve points
        setPixel(cx - 2, cy - 4, mainCol);
        setPixel(cx, cy - 4, mainCol);
        setPixel(cx + 2, cy - 4, mainCol);

        drawStemAndLeaves(cy + 4, 1, 2, '#2d6a4f', '#38b000');
        break;
      }

      case 'rose': {
        // Layered concentric pixel structure (dark inner, lighter outer, red/pink)
        const cx = CENTER;
        const cy = 6;
        const outerCol = pickShade(['#800f2f', '#a4133c']);
        const midCol = pickShade(['#c9184a', '#e63946']);
        const innerCol = pickShade(['#ff4d6d', '#ff758f']);

        // Outer Layer
        for (let i = 0; i < 9; i++) {
          const ang = (i * 40) * (Math.PI / 180);
          setPixel(cx + Math.cos(ang) * 5, cy + Math.sin(ang) * 5, outerCol);
          setPixel(cx + Math.cos(ang) * 4, cy + Math.sin(ang) * 4, midCol);
        }
        // Middle Layer
        for (let i = 0; i < 6; i++) {
          const ang = (i * 60 + 20) * (Math.PI / 180);
          setPixel(cx + Math.cos(ang) * 3, cy + Math.sin(ang) * 3, midCol);
          setPixel(cx + Math.cos(ang) * 2, cy + Math.sin(ang) * 2, innerCol);
        }
        // Inner Spiral
        setPixel(cx, cy, '#ff8fa3');
        setPixel(cx - 1, cy - 1, '#590d22');
        setPixel(cx + 1, cy, '#c9184a');

        drawStemAndLeaves(cy + 4, 1, 2, '#1c5200', '#2d6a4f');
        break;
      }

      case 'lavender': {
        // Long green stem, small purple pixel clusters along both sides
        const cx = CENTER;
        const purpleShades = ['#9d4edd', '#7b2cbf', '#c77dff', '#e0aaff'];

        // Long stem
        for (let y = 1; y < GRID; y++) {
          setPixel(cx, y, '#2d6a4f');
        }
        // Alternating purple clusters along stem
        for (let y = 2; y <= 11; y++) {
          const side = y % 2 === 0 ? -1 : 1;
          const col = pickShade(purpleShades);
          setPixel(cx + side, y, col);
          setPixel(cx + side * 2, y, col);
          setPixel(cx, y - 1, pickShade(purpleShades));
        }
        // Lower leaves
        setPixel(cx - 1, 13, '#38b000');
        setPixel(cx - 2, 14, '#38b000');
        setPixel(cx + 1, 14, '#38b000');
        setPixel(cx + 2, 15, '#38b000');
        break;
      }

      case 'wildflower':
      default: {
        // Small 3–5 pixel flower head + stem
        const cx = CENTER;
        const cy = 5;
        const flowerShades = ['#ffc6ff', '#b8c0ff', '#e7c6ff', '#ffd6ff', '#a0c4ff'];
        setPixel(cx, cy, pickShade(flowerShades));
        setPixel(cx - 1, cy, pickShade(flowerShades));
        setPixel(cx + 1, cy, pickShade(flowerShades));
        setPixel(cx, cy - 1, pickShade(flowerShades));
        setPixel(cx, cy + 1, pickShade(flowerShades));
        setPixel(cx, cy, '#ffff3f'); // yellow center

        drawStemAndLeaves(cy + 2, 1, 1, '#2d6a4f', '#38b000');
        break;
      }
    }
  } catch (err) {
    console.error("generatePixelFlower error caught:", err);
    // Safe fallback daisy if anything failed inside generator
    drawStemAndLeaves(6, 1, 2, '#2d6a4f', '#38b000');
  }

  return { grid: GRID, pixels, meta: { type: type || 'daisy', seed } };
}

/**
 * Generates a default bouquet composition with normalized coordinates.
 * Normalized positions from Section 7 of spec:
 * (0.50, 0.16), (0.35, 0.24), (0.65, 0.24), (0.27, 0.38), (0.50, 0.35),
 * (0.73, 0.38), (0.38, 0.50), (0.62, 0.50)
 */
export function generateDefaultBouquet(isNight = false) {
  const seedRng = makeRng(isNight ? 99999 : 12345);
  const dayTypes = ['rose', 'sunflower', 'tulip', 'daisy', 'lily', 'poppy', 'lavender', 'wildflower'];
  const nightTypes = ['lavender', 'rose', 'lily', 'tulip', 'daisy', 'wildflower'];
  const types = isNight ? nightTypes : dayTypes;

  // Exact normalized main flower coordinates from spec
  const mainNormCoords = [
    { xPct: 0.50, yPct: 0.16, type: types[0], scale: 1.4, sizeClass: 'large' },
    { xPct: 0.35, yPct: 0.24, type: types[1], scale: 1.35, sizeClass: 'large' },
    { xPct: 0.65, yPct: 0.24, type: types[2], scale: 1.35, sizeClass: 'large' },
    { xPct: 0.27, yPct: 0.38, type: types[3], scale: 1.05, sizeClass: 'medium' },
    { xPct: 0.50, yPct: 0.35, type: types[4], scale: 1.15, sizeClass: 'medium' },
    { xPct: 0.73, yPct: 0.38, type: types[5], scale: 1.05, sizeClass: 'medium' },
    { xPct: 0.38, yPct: 0.50, type: types[6 % types.length], scale: 0.75, sizeClass: 'small' },
    { xPct: 0.62, yPct: 0.50, type: types[7 % types.length], scale: 0.75, sizeClass: 'small' },
  ];

  const flowers = mainNormCoords.map((item, i) => ({
    id: `m-fl-${i}`,
    type: item.type,
    sizeClass: item.sizeClass,
    xNorm: (item.xPct - 0.5) * 1.6, // map percentage to [-0.75, 0.75]
    yNorm: item.yPct,
    scale: item.scale,
    rotation: Math.floor((seedRng() * 24) - 12),
    seed: Math.floor(seedRng() * 100000),
  }));

  // Add 4-6 filler wildflowers around bouquet edges
  const fillerCoords = [
    { xPct: 0.18, yPct: 0.30 },
    { xPct: 0.82, yPct: 0.30 },
    { xPct: 0.22, yPct: 0.58 },
    { xPct: 0.78, yPct: 0.58 },
    { xPct: 0.50, yPct: 0.62 },
  ];

  fillerCoords.forEach((item, i) => {
    flowers.push({
      id: `f-fl-${i}`,
      type: 'wildflower',
      sizeClass: 'filler',
      xNorm: (item.xPct - 0.5) * 1.6,
      yNorm: item.yPct,
      scale: 0.45,
      rotation: Math.floor((seedRng() * 60) - 30),
      seed: Math.floor(seedRng() * 100000),
    });
  });

  return {
    flowers,
    isNight,
  };
}

/**
 * Renders a pixel flower map onto an HTML Canvas with crisp non-antialiased pixels.
 */
export function renderPixelFlowerToCanvas(canvas, pixelMap, size = 68) {
  if (!canvas) return;
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, size, size);

    const pixelSize = size / GRID;
    const pixels = pixelMap?.pixels || {};

    for (const [key, color] of Object.entries(pixels)) {
      const [x, y] = key.split(',').map(Number);
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x * pixelSize), Math.round(y * pixelSize), Math.ceil(pixelSize), Math.ceil(pixelSize));
    }
  } catch (err) {
    console.error("renderPixelFlowerToCanvas error caught:", err);
  }
}
