/**
 * The village layout, expressed as data rather than hardcoded JSX.
 * Change a number here and the whole village re-derives from it —
 * see generateVillage.js for how this data becomes actual positions.
 */

export const BOUNDS = { xMin: -40, xMax: 40, zMin: -40, zMax: 40 };
export const CENTER = [0, 0];
export const SEED = 20260828; // change to reshuffle the whole layout deterministically

export const MARKET = {
  center: [0, 0],
  radius: 9,
  stallCount: 8,
  stallRingRadius: 6.5,
  fountainRadius: 1.4,
  benchCount: 6,
  benchRingRadius: 8,
};

export const HOUSES = {
  count: 14,
  ringRadius: 35,
  ringJitter: 2.0,
  roofPalette: ['#e8604a', '#5e8ee0', '#e0a83e', '#7bbf6a', '#c17bd6', '#e0776b'],
  wallPalette: ['#fbead0', '#eaf3ff', '#fff2d9', '#eafbe8', '#f6e8fb'],
  gardenRadius: 2.2,
  gardenFlowerCount: 10,
};

// The 9 inner zones (4 flower gardens, 2 vegetable farms, 1 orchard, 2
// animal pens) are arranged in a ring at radius 20, one every 40
// degrees, in an order chosen so the two largest zones (orchard,
// farms) are never adjacent to each other — always separated by a
// smaller garden or pen. This was verified pairwise (every neighbor
// pair, market clearance, and house-ring clearance) before use; see
// the layout notes in this file's project docs for the check. Do not
// reposition these without re-running that check — moving one zone
// closer to a big neighbor can reintroduce an overlap even though
// each zone individually still "fits" the ring.

export const FLOWER_GARDENS = [
  { center: [-18.79, 6.84], width: 8, depth: 8, count: 80 },  // gardenLargeA
  { center: [15.32, -12.86], width: 8, depth: 8, count: 80 }, // gardenLargeD
  { center: [15.32, 12.86], width: 7, depth: 7, count: 65 },  // gardenSmallB
  { center: [3.47, -19.7], width: 7, depth: 7, count: 65 },   // gardenSmallC
];
export const FLOWER_PALETTE = ['#e8a0c9', '#f2c14e', '#c191e8', '#f28fa4', '#7ec6f2', '#ffffff'];

// Loose flower clusters scattered outside the fenced gardens — along
// paths, near houses, near water — so flowers aren't confined to the
// 4 fenced plots.
export const LOOSE_FLOWER_CLUSTERS = {
  count: 10, // number of clusters
  minSize: 4,
  maxSize: 8, // flowers per cluster: rng-picked in [minSize, maxSize]
  scatterRadius: 26, // kept inside the house band's inner edge (28.8) so
                      // loose flowers land in the village interior, not on houses
};

export const VEGETABLE_FARMS = [
  {
    center: [3.47, 19.7], // farmA (14 x 9)
    width: 14,
    depth: 9,
    rowSpacing: 1.4,
    crops: ['carrot', 'tomato', 'cabbage', 'lettuce', 'pumpkin'],
  },
  {
    center: [-10, -17.32], // farmB (14 x 9)
    width: 14,
    depth: 9,
    rowSpacing: 1.4,
    crops: ['pumpkin', 'corn', 'tomato', 'carrot', 'cabbage'],
  },
];

export const ORCHARD = {
  center: [20, 0],
  width: 12,
  depth: 9,
  spacingX: 3,
  spacingZ: 3, // floor(12/3) x floor(9/3) = 4 x 3 = 12 trees exactly
  types: ['apple', 'orange'],
  fruitPerTree: 7,
  foliageRadius: 0.55, // must match FruitTree's foliage sphere radius
};

export const ANIMAL_PENS = [
  {
    center: [-10, 17.32], // penA
    width: 8,
    depth: 8,
    animals: ['cow', 'sheep', 'sheep', 'chicken', 'chicken', 'chicken'],
  },
  {
    center: [-18.79, -6.84], // penB
    width: 7,
    depth: 6,
    animals: ['rabbit', 'rabbit', 'duck', 'duck', 'horse'],
  },
];

export const FOREST_CLUSTERS = [
  { center: [-34, -30], radius: 9, count: 14 },
  { center: [34, -32], radius: 9, count: 14 },
  { center: [-34, 30], radius: 8, count: 12 },
  { center: [34, 30], radius: 8, count: 12 },
  { center: [0, -36], radius: 10, count: 10 },
];

export const WATER = {
  // A river polyline crossing the village; rendered as a series of
  // connected flat segments rather than one straight rectangle.
  points: [
    [-40, -6],
    [-20, -8],
    [0, -4],
    [18, 2],
    [40, 8],
  ],
  width: 5,
  bridgeAt: [2, 3], // segment indices (between point i and i+1) that get a bridge
  lilyPadCount: 10,
};

export const VILLAGER_COUNT = 12;

export const PATH_WIDTH_MAIN = 4;
export const PATH_WIDTH_MINOR = 2.75;
