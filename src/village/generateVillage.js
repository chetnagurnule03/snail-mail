import {
  makeRng,
  ringPlacement,
  jitteredGrid,
  scatterInCircle,
  clampToBounds,
  fruitOnFoliageSphere,
} from './placement.js';
import {
  BOUNDS,
  CENTER,
  SEED,
  MARKET,
  HOUSES,
  FLOWER_GARDENS,
  FLOWER_PALETTE,
  LOOSE_FLOWER_CLUSTERS,
  VEGETABLE_FARMS,
  ORCHARD,
  ANIMAL_PENS,
  FOREST_CLUSTERS,
  WATER,
  VILLAGER_COUNT,
} from './villageConfig.js';

/**
 * Turns the data-only village config into flat arrays of plain
 * objects ready to .map() onto actual components. Nothing here
 * touches React/three — it's pure layout math, which makes it cheap
 * to unit-test or tweak independent of rendering.
 */
export function generateVillage() {
  const rng = makeRng(SEED);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  // --- Houses, ringed around the village, each with its own garden ---
  const housePlacements = ringPlacement({
    center: CENTER,
    radius: HOUSES.ringRadius,
    count: HOUSES.count,
    jitter: HOUSES.ringJitter,
    rng,
  });

  const houses = housePlacements.map((h, i) => ({
    id: `house-${i}`,
    position: h.position,
    rotationY: h.facingAngle,
    wallColor: pick(HOUSES.wallPalette),
    roofColor: pick(HOUSES.roofPalette),
    mailboxOffset: [Math.cos(h.facingAngle) * 1.4, Math.sin(h.facingAngle) * 1.4],
  }));

  const houseGardenFlowers = houses.flatMap((house, i) => {
    const pts = scatterInCircle({
      center: [house.position[0] - 2.0, house.position[1]],
      radius: HOUSES.gardenRadius,
      count: HOUSES.gardenFlowerCount,
      minDist: 0.35,
      rng,
    });
    return pts.map((p, j) => ({
      id: `house-garden-${i}-${j}`,
      position: p.position,
      color: pick(FLOWER_PALETTE),
    }));
  });

  // --- Market: ring of stalls + fountain + benches around center ---
  const stalls = Array.from({ length: MARKET.stallCount }).map((_, i) => {
    const angle = (i / MARKET.stallCount) * Math.PI * 2;
    return {
      id: `stall-${i}`,
      position: [
        MARKET.center[0] + Math.cos(angle) * MARKET.stallRingRadius,
        MARKET.center[1] + Math.sin(angle) * MARKET.stallRingRadius,
      ],
      rotationY: angle + Math.PI,
      awningColor: pick(['#e8604a', '#5e8ee0', '#e0a83e', '#7bbf6a', '#c191e8']),
      goods: pick(['flowers', 'fruit', 'vegetables', 'plants', 'handmade']),
    };
  });

  const benches = Array.from({ length: MARKET.benchCount }).map((_, i) => {
    const angle = (i / MARKET.benchCount) * Math.PI * 2 + Math.PI / MARKET.benchCount;
    return {
      id: `bench-${i}`,
      position: [
        MARKET.center[0] + Math.cos(angle) * MARKET.benchRingRadius,
        MARKET.center[1] + Math.sin(angle) * MARKET.benchRingRadius,
      ],
      rotationY: angle,
    };
  });

  // --- Flower gardens: fenced plots filled with a jittered grid ---
  const flowerGardens = FLOWER_GARDENS.map((garden, gi) => {
    const grid = jitteredGrid({
      center: garden.center,
      width: garden.width,
      depth: garden.depth,
      spacingX: garden.width / Math.ceil(Math.sqrt(garden.count)),
      spacingZ: garden.depth / Math.ceil(Math.sqrt(garden.count)),
      jitter: 0.4,
      rng,
    }).slice(0, garden.count);

    return {
      id: `garden-${gi}`,
      fence: { center: garden.center, width: garden.width, depth: garden.depth },
      flowers: grid.map((p, i) => ({
        id: `garden-${gi}-flower-${i}`,
        position: p.position,
        color: pick(FLOWER_PALETTE),
      })),
    };
  });

  // --- Vegetable farms: fenced 14x9 plots with 10x6 crop rows (60 crops per farm = 120 total) ---
  const vegetableFarms = VEGETABLE_FARMS.map((farm, fi) => {
    const rows = jitteredGrid({
      center: farm.center,
      width: farm.width - 0.4,
      depth: farm.depth - 0.4,
      spacingX: (farm.width - 0.4) / 10,
      spacingZ: (farm.depth - 0.4) / 6,
      jitter: 0.08,
      rng,
    }).slice(0, 60);

    return {
      id: `farm-${fi}`,
      fence: { center: farm.center, width: farm.width, depth: farm.depth },
      crops: rows.map((p, i) => ({
        id: `farm-${fi}-crop-${i}`,
        position: p.position,
        type: farm.crops[i % farm.crops.length],
      })),
    };
  });

  // --- Orchard: grid of fruit trees, each with fruit placed via the
  // spherical fruit-on-foliage formula ---
  const orchardTrees = jitteredGrid({
    center: ORCHARD.center,
    width: ORCHARD.width,
    depth: ORCHARD.depth,
    spacingX: ORCHARD.spacingX,
    spacingZ: ORCHARD.spacingZ,
    jitter: 0.2,
    rng,
  }).map((p, i) => ({
    id: `orchard-${i}`,
    position: p.position,
    fruitType: ORCHARD.types[i % ORCHARD.types.length],
    fruitOffsets: fruitOnFoliageSphere({
      radius: ORCHARD.foliageRadius,
      count: ORCHARD.fruitPerTree,
      rng,
    }),
  }));

  // --- Animal pens ---
  const animalPens = ANIMAL_PENS.map((pen, pi) => {
    const spots = scatterInCircle({
      center: pen.center,
      radius: Math.min(pen.width, pen.depth) / 2 - 0.6,
      count: pen.animals.length,
      minDist: 1.1,
      rng,
    });
    return {
      id: `pen-${pi}`,
      fence: { center: pen.center, width: pen.width, depth: pen.depth },
      width: pen.width,
      depth: pen.depth,
      animals: pen.animals.map((type, i) => ({
        id: `pen-${pi}-animal-${i}`,
        type,
        position: spots[i]?.position ?? pen.center,
      })),
    };
  });

  // --- Forest clusters ---
  const forestTrees = FOREST_CLUSTERS.flatMap((cluster, ci) => {
    const pts = scatterInCircle({
      center: cluster.center,
      radius: cluster.radius,
      count: cluster.count,
      minDist: 1.6,
      rng,
    });
    return pts.map((p, i) => {
      const [x, z] = clampToBounds(p.position[0], p.position[1], BOUNDS);
      return {
        id: `forest-${ci}-${i}`,
        position: [x, z],
        scale: 0.7 + rng() * 0.7,
        rotationY: rng() * Math.PI * 2,
        kind: rng() > 0.5 ? 'round' : 'pine',
      };
    });
  });

  // --- Villagers: scattered near market + farms + paths ---
  const villagerSpots = scatterInCircle({
    center: CENTER,
    radius: 24,
    count: VILLAGER_COUNT,
    minDist: 3,
    rng,
  });
  const villagers = villagerSpots.map((p, i) => ({
    id: `villager-${i}`,
    position: p.position,
    outfitColor: pick(['#c9a7e0', '#f2a6a0', '#a6d0e0', '#e0c987', '#8fd0a0']),
    hairColor: pick(['#3a2e22', '#7a4a2b', '#1f1f1f', '#c98f4a']),
    skinTone: pick(['#f2c9a0', '#e0a878', '#c98a5c']),
  }));

  // --- Water: river polyline + bridges + lily pads ---
  const riverSegments = WATER.points.slice(0, -1).map((p, i) => ({
    id: `river-seg-${i}`,
    from: p,
    to: WATER.points[i + 1],
    width: WATER.width,
    hasBridge: WATER.bridgeAt.includes(i),
  }));
  const lilyPads = scatterInCircle({
    center: WATER.points[Math.floor(WATER.points.length / 2)],
    radius: 6,
    count: WATER.lilyPadCount,
    minDist: 1,
    rng,
  }).map((p, i) => ({ id: `lily-${i}`, position: p.position }));

  // --- Loose flower clusters scattered outside the fenced gardens ---
  const looseFlowerSpots = scatterInCircle({
    center: CENTER,
    radius: LOOSE_FLOWER_CLUSTERS.scatterRadius,
    count: LOOSE_FLOWER_CLUSTERS.count,
    minDist: 5,
    rng,
  });
  const looseFlowerClusters = looseFlowerSpots.map((spot, ci) => {
    const size =
      LOOSE_FLOWER_CLUSTERS.minSize +
      Math.floor(rng() * (LOOSE_FLOWER_CLUSTERS.maxSize - LOOSE_FLOWER_CLUSTERS.minSize + 1));
    const flowers = scatterInCircle({
      center: spot.position,
      radius: 1.1,
      count: size,
      minDist: 0.3,
      rng,
    }).map((p, i) => ({
      id: `loose-${ci}-${i}`,
      position: p.position,
      color: pick(FLOWER_PALETTE),
    }));
    return { id: `loose-cluster-${ci}`, flowers };
  });

  return {
    bounds: BOUNDS,
    houses,
    houseGardenFlowers,
    market: { stalls, benches, fountainCenter: MARKET.center, fountainRadius: MARKET.fountainRadius },
    flowerGardens,
    looseFlowerClusters,
    vegetableFarms,
    orchardTrees,
    animalPens,
    forestTrees,
    villagers,
    river: { segments: riverSegments, lilyPads },
  };
}
