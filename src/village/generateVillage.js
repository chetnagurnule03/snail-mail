import {
  makeRng,
  ringPlacement,
  jitteredGrid,
  scatterInCircle,
  clampToBounds,
} from './placement.js';
import {
  BOUNDS,
  CENTER,
  SEED,
  MARKET,
  HOUSES,
  FLOWER_GARDENS,
  FLOWER_PALETTE,
  VEGETABLE_FARMS,
  ORCHARD,
  ANIMAL_PENS,
  FOREST_CLUSTERS,
  FILLER_ROCKS,
  FILLER_BUSHES,
  STEPPING_STONES,
  WATER,
  VILLAGER_COUNT,
} from './villageConfig.js';

/**
 * Turns the data-only village config into flat arrays of plain
 * objects ready to .map() onto actual components.
 */
export function generateVillage() {
  const rng = makeRng(SEED);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  // --- Houses ---
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
    mailboxOffset: [Math.cos(h.facingAngle) * 2.2, Math.sin(h.facingAngle) * 2.2],
  }));

  const houseGardenFlowers = houses.flatMap((house, i) => {
    const pts = scatterInCircle({
      center: [house.position[0] - 2.5, house.position[1]],
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

  // --- Market ---
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

  // --- Flower gardens ---
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

  // --- Vegetable farms ---
  const vegetableFarms = VEGETABLE_FARMS.map((farm, fi) => {
    const rows = jitteredGrid({
      center: farm.center,
      width: farm.width,
      depth: farm.depth,
      spacingX: farm.rowSpacing,
      spacingZ: farm.rowSpacing,
      jitter: 0.15,
      rng,
    });
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

  // --- Orchard ---
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

  // --- Filler Rocks, Bushes, and Stepping Stones ---
  const rockSpots = scatterInCircle({
    center: CENTER,
    radius: FILLER_ROCKS.maxRadius,
    count: FILLER_ROCKS.count,
    minDist: 2.2,
    rng,
  });
  const fillerRocks = rockSpots.map((p, i) => ({
    id: `rock-${i}`,
    position: p.position,
    scale: 0.4 + rng() * 0.5,
  }));

  const bushSpots = scatterInCircle({
    center: CENTER,
    radius: FILLER_BUSHES.maxRadius,
    count: FILLER_BUSHES.count,
    minDist: 2.0,
    rng,
  });
  const fillerBushes = bushSpots.map((p, i) => ({
    id: `bush-${i}`,
    position: p.position,
    scale: 0.5 + rng() * 0.4,
  }));

  const stoneSpots = scatterInCircle({
    center: CENTER,
    radius: STEPPING_STONES.maxRadius,
    count: STEPPING_STONES.count,
    minDist: 1.8,
    rng,
  });
  const steppingStones = stoneSpots.map((p, i) => ({
    id: `stone-${i}`,
    position: p.position,
    scale: 0.35 + rng() * 0.3,
  }));

  // --- Villagers ---
  const villagerSpots = scatterInCircle({
    center: CENTER,
    radius: 22,
    count: VILLAGER_COUNT,
    minDist: 3.5,
    rng,
  });
  const villagers = villagerSpots.map((p, i) => ({
    id: `villager-${i}`,
    position: p.position,
    outfitColor: pick(['#c9a7e0', '#f2a6a0', '#a6d0e0', '#e0c987', '#8fd0a0']),
    hairColor: pick(['#3a2e22', '#7a4a2b', '#1f1f1f', '#c98f4a']),
    skinTone: pick(['#f2c9a0', '#e0a878', '#c98a5c']),
  }));

  // --- Water ---
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

  return {
    bounds: BOUNDS,
    houses,
    houseGardenFlowers,
    market: { stalls, benches, fountainCenter: MARKET.center, fountainRadius: MARKET.fountainRadius },
    flowerGardens,
    vegetableFarms,
    orchardTrees,
    animalPens,
    forestTrees,
    fillerRocks,
    fillerBushes,
    steppingStones,
    villagers,
    river: { segments: riverSegments, lilyPads },
  };
}
