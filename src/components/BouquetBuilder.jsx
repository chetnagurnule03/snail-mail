import React, { useState } from 'react';

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
 *  LIVE BOUQUET SVG RENDERER (SHARED FOR PREVIEW & LETTER VIEW)
 * ------------------------------------------------------------- */
export function RenderBouquetSVG({ bouquet, width = 280, height = 300 }) {
  const selectedFlowers = bouquet?.flowers || [];
  const selectedGreenery = bouquet?.greenery || [];
  const wrap = bouquet?.wrap || WRAP_STYLES[0];
  const ribbon = bouquet?.ribbon || RIBBON_STYLES[0];
  const card = bouquet?.card || CARD_STYLES[0];
  const bg = bouquet?.background || BACKGROUND_STYLES[0];

  const bgColor = bg.color || '#f4e9d8';
  const wrapColor = wrap.color || '#d4a373';
  const ribbonColor = ribbon.color || '#e63946';

  return (
    <svg width={width} height={height} viewBox="0 0 280 300" style={{ background: bgColor, borderRadius: 16 }}>
      {/* Background Subtle Gradient */}
      <rect width="280" height="300" rx="16" fill={bgColor} />
      <circle cx="140" cy="150" r="110" fill="#ffffff" opacity="0.15" />

      {/* Greenery Fan Behind Flowers */}
      {selectedGreenery.map((g, idx) => {
        const angle = -45 + (idx * 30);
        const rad = (angle * Math.PI) / 180;
        const gx = 140 + Math.cos(rad) * 65;
        const gy = 120 + Math.sin(rad) * 45;
        return (
          <g key={`g-${idx}`} transform={`translate(${gx}, ${gy}) rotate(${angle})`}>
            <path d="M 0 0 Q -15 -35 0 -60 Q 15 -35 0 0" fill={g.color || '#38b000'} opacity="0.85" />
            <line x1="0" y1="0" x2="0" y2="-55" stroke="#1c5200" strokeWidth="1.5" />
          </g>
        );
      })}

      {/* Flower Stems */}
      <g>
        {selectedFlowers.map((_, idx) => {
          const spread = (idx - (selectedFlowers.length - 1) / 2) * 12;
          return (
            <line
              key={`stem-${idx}`}
              x1={140 + spread * 0.4}
              y1="130"
              x2={140 + spread}
              y2="220"
              stroke="#2d6a4f"
              strokeWidth="3"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Arranged Flower Heads */}
      {selectedFlowers.map((f, idx) => {
        const count = selectedFlowers.length;
        const angle = ((idx - (count - 1) / 2) / (count || 1)) * 1.2;
        const fx = 140 + Math.sin(angle) * 55;
        const fy = 100 + Math.cos(angle * 1.5) * 35;
        const fl = FLOWER_TYPES.find((ft) => ft.id === f.type) || FLOWER_TYPES[0];

        const petals = [];
        const numPetals = fl.petalCount || 6;
        for (let p = 0; p < numPetals; p++) {
          const pAngle = (p * (360 / numPetals) * Math.PI) / 180;
          const px = fx + Math.cos(pAngle) * 16;
          const py = fy + Math.sin(pAngle) * 16;
          petals.push({ px, py });
        }

        return (
          <g key={`fl-${idx}-${f.id}`}>
            {/* Petals */}
            {petals.map((pt, pIdx) => (
              <circle key={pIdx} cx={pt.px} cy={pt.py} r="10" fill={fl.petalColor} stroke="#2b2013" strokeWidth="0.8" />
            ))}
            {/* Flower Center */}
            <circle cx={fx} cy={fy} r="10" fill={fl.centerColor} stroke="#2b2013" strokeWidth="1" />
          </g>
        );
      })}

      {/* Paper Wrap Conical Cone */}
      <polygon points="90,170 190,170 155,270 125,270" fill={wrapColor} stroke="#5c381e" strokeWidth="2" />
      <polygon points="90,170 140,210 190,170" fill="#ffffff" opacity="0.2" />

      {/* Ribbon & Bow */}
      <g transform="translate(140, 205)">
        <ellipse cx="0" cy="0" rx="26" ry="7" fill={ribbonColor} />
        {/* Bow Loops */}
        <path d="M 0 0 C -25 -20 -30 10 0 0" fill={ribbonColor} stroke="#2b2013" strokeWidth="1" />
        <path d="M 0 0 C 25 -20 30 10 0 0" fill={ribbonColor} stroke="#2b2013" strokeWidth="1" />
        <circle cx="0" cy="0" r="5" fill="#ffffff" />
      </g>

      {/* Attached Note Card */}
      {card && (
        <g transform="translate(165, 215) rotate(12)">
          <rect width="45" height="30" rx="4" fill={card.color || '#fffcf2'} stroke="#5c381e" strokeWidth="1.5" />
          <line x1="6" y1="10" x2="39" y2="10" stroke="#7a5c3e" strokeWidth="1" />
          <line x1="6" y1="18" x2="30" y2="18" stroke="#7a5c3e" strokeWidth="1" />
        </g>
      )}
    </svg>
  );
}

/** -------------------------------------------------------------
 *  MAIN BOUQUET BUILDER COMPONENT
 * ------------------------------------------------------------- */
export default function BouquetBuilder({ onDone, onCancel }) {
  const [activeStep, setActiveStep] = useState(0); // 0: Flowers, 1: Greenery, 2: Wrap, 3: Card, 4: Background, 5: Preview

  const [selectedFlowers, setSelectedFlowers] = useState([
    { id: 'f-1', type: 'rose' },
    { id: 'f-2', type: 'daisy' },
    { id: 'f-3', type: 'tulip' },
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
      { id: 'f-2', type: 'daisy' },
      { id: 'f-3', type: 'tulip' },
    ]);
    setSelectedGreenery([GREENERY_TYPES[0]]);
    setSelectedWrap(WRAP_STYLES[0]);
    setSelectedRibbon(RIBBON_STYLES[0]);
    setSelectedCard(CARD_STYLES[0]);
    setSelectedBg(BACKGROUND_STYLES[0]);
  };

  const currentBouquetData = {
    flowers: selectedFlowers,
    greenery: selectedGreenery,
    wrap: selectedWrap,
    ribbon: selectedRibbon,
    card: selectedCard,
    background: selectedBg,
  };

  const isValidFlowers = selectedFlowers.length >= 3 && selectedFlowers.length <= 8;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
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
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill={ft.color} stroke="#2b2013" strokeWidth="1.5" />
                      <circle cx="20" cy="20" r="6" fill={ft.centerColor} />
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
