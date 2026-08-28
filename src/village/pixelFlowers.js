/**
 * PIXEL FLOWER GENERATION SYSTEM (17x17 Grid)
 *
 * True pixel-art generated from code using sparse {"x,y": "#color"} maps.
 * Grid: 17x17, Center: (8, 8).
 * Contains: FLOWER HEAD + STEM + LEAVES.
 */

export const GRID = 17;
export const CENTER = 8;

export function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const FLOWER_TYPES = ['daisy', 'tulip', 'rose', 'poppy', 'lily', 'sunflower', 'lavender'];

/**
 * Generates a 17x17 pixel map for a given flower type and seed.
 * Returns { grid: 17, pixels: { "x,y": "#color" }, meta: { type, seed } }
 */
export function generatePixelFlower(type = 'daisy', seed = 12345) {
  const rng = makeRng(seed);
  const pixels = {};

  function setPixel(x, y, color) {
    const rx = Math.round(x);
    const ry = Math.round(y);
    if (rx >= 0 && rx < GRID && ry >= 0 && ry < GRID) {
      pixels[`${rx},${ry}`] = color;
    }
  }

  // Random color shade helper
  function pickShade(palette) {
    return palette[Math.floor(rng() * palette.length)];
  }

  // Draw stem and leaves
  function drawStemAndLeaves(stemYStart, stemWidth = 1, leafCount = 2, stemColor = '#2d6a4f', leafColor = '#38b000') {
    // Stem
    for (let y = stemYStart; y < GRID; y++) {
      for (let w = 0; w < stemWidth; w++) {
        setPixel(CENTER + w - Math.floor(stemWidth / 2), y, stemColor);
      }
    }
    // Leaves
    const leafY1 = stemYStart + 3 + Math.floor(rng() * 2);
    const leafY2 = leafY1 + 2 + Math.floor(rng() * 2);

    // Left Leaf
    setPixel(CENTER - 1, leafY1, leafColor);
    setPixel(CENTER - 2, leafY1 - 1, leafColor);
    setPixel(CENTER - 3, leafY1 - 1, leafColor);
    if (leafCount >= 2) {
      // Right Leaf
      setPixel(CENTER + stemWidth, leafY2, leafColor);
      setPixel(CENTER + stemWidth + 1, leafY2 - 1, leafColor);
      setPixel(CENTER + stemWidth + 2, leafY2 - 1, leafColor);
    }
    if (leafCount >= 3) {
      setPixel(CENTER - 1, leafY2 + 1, leafColor);
      setPixel(CENTER - 2, leafY2 + 2, leafColor);
    }
  }

  // Generator math for each flower type
  switch (type.toLowerCase()) {
    case 'daisy': {
      const petalShades = ['#ffffff', '#f4f1de', '#fffcf2', '#f8f9fa'];
      const centerShades = ['#ffb703', '#ffee8c', '#fb8500'];
      const cx = CENTER + (Math.floor(rng() * 3) - 1);
      const cy = 6 + (Math.floor(rng() * 3) - 1);
      const petalCount = 10 + Math.floor(rng() * 5); // 10-14
      const petalLen = 4 + (rng() > 0.5 ? 1 : 0);

      // Petals
      for (let i = 0; i < petalCount; i++) {
        const ang = (i * (360 / petalCount) + (rng() * 10 - 5)) * (Math.PI / 180);
        const col = pickShade(petalShades);
        for (let r = 2; r <= petalLen; r++) {
          const px = cx + Math.cos(ang) * r;
          const py = cy + Math.sin(ang) * r;
          setPixel(px, py, col);
          if (r >= 3) {
            setPixel(px + (Math.abs(Math.cos(ang)) < 0.5 ? 1 : 0), py, col);
          }
        }
      }

      // Yellow Center Disc (2-3px radius)
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          if (dx * dx + dy * dy <= 4) {
            setPixel(cx + dx, cy + dy, pickShade(centerShades));
          }
        }
      }
      setPixel(cx - 1, cy - 1, '#ffffff'); // highlight

      drawStemAndLeaves(cy + 3, 1, 2, '#2d6a4f', '#38b000');
      break;
    }

    case 'poppy': {
      const petalShades = ['#e63946', '#ff5400', '#d62828', '#ff4d6d'];
      const cx = CENTER;
      const cy = 6;
      const petalCount = 5;

      // 5 Broad Petals
      for (let i = 0; i < petalCount; i++) {
        const ang = (i * 72 + (rng() * 12 - 6)) * (Math.PI / 180);
        const col = pickShade(petalShades);
        for (let r = 2; r <= 6; r++) {
          for (let spread = -2; spread <= 2; spread++) {
            const px = cx + Math.cos(ang) * r + Math.sin(ang) * (spread * 0.4);
            const py = cy + Math.sin(ang) * r - Math.cos(ang) * (spread * 0.4);
            setPixel(px, py, col);
          }
        }
      }

      // Dark Center
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          setPixel(cx + dx, cy + dy, '#1a1a1a');
        }
      }
      setPixel(cx, cy, '#2b001e');

      drawStemAndLeaves(cy + 4, 1, 2, '#1c5200', '#2d6a4f');
      break;
    }

    case 'lily': {
      const petalShades = ['#ffb703', '#ffd166', '#ff8fa3', '#ffc6ff'];
      const cx = CENTER;
      const cy = 6;

      // 6 Large Tapered Petals
      for (let i = 0; i < 6; i++) {
        const ang = (i * 60 + (rng() * 8 - 4)) * (Math.PI / 180);
        const col = pickShade(petalShades);
        for (let r = 1; r <= 6; r++) {
          const width = r <= 3 ? 1 : 2;
          for (let w = -width; w <= width; w++) {
            const px = cx + Math.cos(ang) * r + Math.sin(ang) * (w * 0.3);
            const py = cy + Math.sin(ang) * r - Math.cos(ang) * (w * 0.3);
            setPixel(px, py, col);
          }
        }
      }

      // Center Detail
      setPixel(cx, cy, '#fb8500');
      setPixel(cx - 1, cy, '#ffb703');
      setPixel(cx + 1, cy, '#ffb703');

      drawStemAndLeaves(cy + 4, 1, 2, '#2d6a4f', '#38b000');
      break;
    }

    case 'sunflower': {
      const petalShades = ['#ffea00', '#ffb703', '#ffd000', '#fb8500'];
      const centerShades = ['#5c381e', '#8c5a3c', '#3d2616', '#2b180d'];
      const cx = CENTER;
      const cy = 7;
      const petalCount = 14;

      // 14 Narrow Yellow Petals
      for (let i = 0; i < petalCount; i++) {
        const ang = (i * (360 / petalCount)) * (Math.PI / 180);
        const col = pickShade(petalShades);
        for (let r = 3; r <= 6; r++) {
          const px = cx + Math.cos(ang) * r;
          const py = cy + Math.sin(ang) * r;
          setPixel(px, py, col);
        }
      }

      // Large Dark Brown Circular Center Cluster
      for (let dx = -3; dx <= 3; dx++) {
        for (let dy = -3; dy <= 3; dy++) {
          if (dx * dx + dy * dy <= 9) {
            setPixel(cx + dx, cy + dy, pickShade(centerShades));
          }
        }
      }

      drawStemAndLeaves(cy + 4, 2, 3, '#1c5200', '#2d6a4f');
      break;
    }

    case 'tulip': {
      const tulipShades = ['#ff4d6d', '#c9184a', '#e63946', '#ff758f'];
      const cx = CENTER;
      const cy = 6;
      const mainCol = pickShade(tulipShades);

      // Goblet Silhouette
      for (let y = cy - 3; y <= cy + 3; y++) {
        const w = y <= cy ? (y - (cy - 3)) + 1 : (cy + 3 - y) + 2;
        for (let x = cx - w; x <= cx + w; x++) {
          const col = x === cx - w || x === cx + w ? '#800f2f' : mainCol;
          setPixel(x, y, col);
        }
      }
      // Top uneven curve silhouette
      setPixel(cx - 2, cy - 4, mainCol);
      setPixel(cx, cy - 4, mainCol);
      setPixel(cx + 2, cy - 4, mainCol);

      // Pointed Leaves near stem
      for (let y = 10; y <= 15; y++) {
        setPixel(cx - (15 - y), y, '#38b000');
        setPixel(cx + (15 - y), y, '#38b000');
      }

      drawStemAndLeaves(cy + 4, 1, 2, '#2d6a4f', '#38b000');
      break;
    }

    case 'rose': {
      const outerShades = ['#800f2f', '#a4133c', '#590d22'];
      const midShades = ['#c9184a', '#e63946'];
      const innerShades = ['#ff4d6d', '#ff758f'];
      const cx = CENTER;
      const cy = 6;

      // Outer Petal Layer (8-10)
      for (let i = 0; i < 9; i++) {
        const ang = (i * 40) * (Math.PI / 180);
        const px = cx + Math.cos(ang) * 5;
        const py = cy + Math.sin(ang) * 5;
        setPixel(px, py, pickShade(outerShades));
        setPixel(px + 1, py, pickShade(outerShades));
      }

      // Middle Layer (6-8)
      for (let i = 0; i < 7; i++) {
        const ang = (i * 51 + 20) * (Math.PI / 180);
        const px = cx + Math.cos(ang) * 3;
        const py = cy + Math.sin(ang) * 3;
        setPixel(px, py, pickShade(midShades));
      }

      // Inner Layer & Center Spiral
      for (let i = 0; i < 5; i++) {
        const ang = (i * 72 + 35) * (Math.PI / 180);
        const px = cx + Math.cos(ang) * 1.5;
        const py = cy + Math.sin(ang) * 1.5;
        setPixel(px, py, pickShade(innerShades));
      }
      setPixel(cx, cy, '#ff8fa3');
      setPixel(cx - 1, cy - 1, '#590d22');

      drawStemAndLeaves(cy + 4, 1, 2, '#1c5200', '#2d6a4f');
      break;
    }

    case 'lavender': {
      const purpleShades = ['#9d4edd', '#7b2cbf', '#c77dff', '#e0aaff'];
      const cx = CENTER;

      // Stem
      for (let y = 1; y < GRID; y++) {
        setPixel(cx, y, '#2d6a4f');
      }

      // 8-12 Vertical Purple Cluster Spikes
      for (let y = 2; y <= 11; y++) {
        const side = y % 2 === 0 ? -1 : 1;
        const col = pickShade(purpleShades);
        setPixel(cx + side, y, col);
        setPixel(cx + side * 2, y, col);
        setPixel(cx, y - 1, pickShade(purpleShades));
      }

      // 2 Small leaves at lower stem
      setPixel(cx - 1, 13, '#38b000');
      setPixel(cx - 2, 14, '#38b000');
      setPixel(cx + 1, 14, '#38b000');
      setPixel(cx + 2, 15, '#38b000');
      break;
    }

    default: {
      drawStemAndLeaves(6, 1, 2, '#2d6a4f', '#38b000');
      break;
    }
  }

  return { grid: GRID, pixels, meta: { type, seed } };
}

/**
 * Renders a pixel flower map onto an HTML Canvas (e.g. 68x68 px canvas).
 * Hard-edged non-antialiased rectangular pixels.
 */
export function renderPixelFlowerToCanvas(canvas, pixelMap, size = 68) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, size, size);

  const pixelSize = size / GRID;
  const pixels = pixelMap.pixels || {};

  for (const [key, color] of Object.entries(pixels)) {
    const [x, y] = key.split(',').map(Number);
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x * pixelSize), Math.round(y * pixelSize), Math.ceil(pixelSize), Math.ceil(pixelSize));
  }
}
