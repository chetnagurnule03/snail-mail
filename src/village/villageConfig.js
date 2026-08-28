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
  radius: 8,
  stallCount: 8,
  stallRingRadius: 6.0,
  fountainRadius: 1.5,
  benchCount: 6,
  benchRingRadius: 7.5,
};

export const HOUSES = {
  count: 14,
  ringRadius: 26,
  ringJitter: 2.0,
  roofPalette: ['#e8604a', '#5e8ee0', '#e0a83e', '#7bbf6a', '#c17bd6', '#e0776b'],
  wallPalette: ['#fbead0', '#eaf3ff', '#fff2d9', '#eafbe8', '#f6e8fb'],
  gardenRadius: 2.8,
  gardenFlowerCount: 12,
};

export const FLOWER_GARDENS = [
  { center: [-15, -15], width: 7.5, depth: 7.5, count: 70 },
  { center: [15, -15], width: 7.5, depth: 7.5, count: 70 },
  { center: [-15, 15], width: 7.0, depth: 7.0, count: 55 },
  { center: [15, 15], width: 7.0, depth: 7.0, count: 55 },
];
export const FLOWER_PALETTE = ['#e8a0c9', '#f2c14e', '#c191e8', '#f28fa4', '#7ec6f2', '#ffffff'];

export const VEGETABLE_FARMS = [
  {
    center: [-10, 8],
    width: 11,
    depth: 8,
    rowSpacing: 1.4,
    crops: ['carrot', 'tomato', 'cabbage', 'lettuce'],
  },
  {
    center: [10, 9],
    width: 10,
    depth: 7.5,
    rowSpacing: 1.4,
    crops: ['pumpkin', 'corn', 'tomato'],
  },
];

export const ORCHARD = {
  center: [18, 2],
  width: 11,
  depth: 11,
  spacingX: 3.2,
  spacingZ: 3.2,
  types: ['apple', 'orange'],
};

export const ANIMAL_PENS = [
  {
    center: [-18, 2],
    width: 8.5,
    depth: 8.5,
    animals: ['cow', 'cow', 'sheep', 'sheep', 'chicken', 'chicken'],
  },
  {
    center: [-10, -9],
    width: 7.5,
    depth: 7.0,
    animals: ['rabbit', 'duck', 'duck', 'horse'],
  },
];

export const FOREST_CLUSTERS = [
  { center: [-34, -30], radius: 9, count: 14 },
  { center: [34, -32], radius: 9, count: 14 },
  { center: [-34, 30], radius: 8, count: 12 },
  { center: [34, 30], radius: 8, count: 12 },
  { center: [0, -35], radius: 10, count: 10 },
];

export const FILLER_ROCKS = { count: 35, maxRadius: 32 };
export const FILLER_BUSHES = { count: 45, maxRadius: 32 };
export const STEPPING_STONES = { count: 30, maxRadius: 28 };

export const WATER = {
  points: [
    [-40, -6],
    [-20, -7],
    [0, -4],
    [18, 2],
    [40, 7],
  ],
  width: 5,
  bridgeAt: [2, 3],
  lilyPadCount: 12,
};

export const VILLAGER_COUNT = 12;

export const PATH_WIDTH_MAIN = 4;
export const PATH_WIDTH_MINOR = 2.75;
