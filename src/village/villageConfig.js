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
  ringRadius: 30,
  ringJitter: 2.5,
  roofPalette: ['#e8604a', '#5e8ee0', '#e0a83e', '#7bbf6a', '#c17bd6', '#e0776b'],
  wallPalette: ['#fbead0', '#eaf3ff', '#fff2d9', '#eafbe8', '#f6e8fb'],
  gardenRadius: 2.2,
  gardenFlowerCount: 10,
};

export const FLOWER_GARDENS = [
  { center: [-20, -20], width: 7, depth: 7, count: 70 },
  { center: [20, -20], width: 7, depth: 7, count: 70 },
  { center: [-20, 20], width: 6, depth: 6, count: 55 },
  { center: [20, 20], width: 6, depth: 6, count: 55 },
];
export const FLOWER_PALETTE = ['#e8a0c9', '#f2c14e', '#c191e8', '#f28fa4', '#7ec6f2', '#ffffff'];

export const VEGETABLE_FARMS = [
  {
    center: [-12, 12],
    width: 12,
    depth: 8,
    rowSpacing: 1.4,
    crops: ['carrot', 'tomato', 'cabbage', 'lettuce'],
  },
  {
    center: [12, 14],
    width: 10,
    depth: 7,
    rowSpacing: 1.4,
    crops: ['pumpkin', 'corn', 'tomato'],
  },
];

export const ORCHARD = {
  center: [24, 2],
  width: 12,
  depth: 12,
  spacingX: 3.2,
  spacingZ: 3.2,
  types: ['apple', 'orange'],
};

export const ANIMAL_PENS = [
  {
    center: [-24, 4],
    width: 8,
    depth: 8,
    animals: ['cow', 'sheep', 'sheep', 'chicken', 'chicken'],
  },
  {
    center: [-14, -12],
    width: 7,
    depth: 6,
    animals: ['rabbit', 'duck', 'duck', 'horse'],
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
