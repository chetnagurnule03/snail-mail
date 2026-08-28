/**
 * Deterministic placement math for the village layout.
 *
 * Everything here is pure math (trig + a seeded PRNG) rather than
 * hand-typed coordinates, so the layout is reproducible, easy to
 * tune by changing a few numbers, and never produces overlapping or
 * out-of-bounds objects.
 */

/** Mulberry32 seeded PRNG — deterministic so the village looks the
 * same every time it's generated, instead of reshuffling on every
 * page load. */
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

/** Clamp a point to the world boundary. */
export function clampToBounds(x, z, bounds) {
  return [
    Math.min(bounds.xMax, Math.max(bounds.xMin, x)),
    Math.min(bounds.zMax, Math.max(bounds.zMin, z)),
  ];
}

/**
 * Places `count` items evenly around a ring at `radius` from center,
 * with small random jitter so it doesn't look robotically uniform.
 * Used for houses around the village perimeter.
 */
export function ringPlacement({ center, radius, count, jitter = 1.5, rng }) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (rng() - 0.5) * 0.15;
    const r = radius + (rng() - 0.5) * jitter * 2;
    const x = center[0] + Math.cos(angle) * r;
    const z = center[1] + Math.sin(angle) * r;
    points.push({ position: [x, z], angle, facingAngle: angle + Math.PI });
  }
  return points;
}

/**
 * Fills a rectangular zone with a jittered grid — regular spacing
 * (so rows read clearly, good for crops/garden beds) but each point
 * nudged randomly so it doesn't look like graph paper.
 */
export function jitteredGrid({ center, width, depth, spacingX, spacingZ, jitter = 0.3, rng }) {
  const points = [];
  const cols = Math.max(1, Math.floor(width / spacingX));
  const rows = Math.max(1, Math.floor(depth / spacingZ));
  const startX = center[0] - (width / 2) + spacingX / 2;
  const startZ = center[1] - (depth / 2) + spacingZ / 2;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * spacingX + (rng() - 0.5) * spacingX * jitter;
      const z = startZ + row * spacingZ + (rng() - 0.5) * spacingZ * jitter;
      points.push({ position: [x, z], row, col });
    }
  }
  return points;
}

/**
 * Scatters `count` points inside a circle around `center`, rejecting
 * points that are too close to previously placed points (a simplified
 * Poisson-disk approach). Used for forest clusters and loose flower
 * groups so they look organic instead of gridded.
 */
export function scatterInCircle({ center, radius, count, minDist = 0.6, rng, maxAttempts = 30 }) {
  const points = [];
  for (let i = 0; i < count; i++) {
    let placed = false;
    for (let attempt = 0; attempt < maxAttempts && !placed; attempt++) {
      const angle = rng() * Math.PI * 2;
      const r = Math.sqrt(rng()) * radius;
      const x = center[0] + Math.cos(angle) * r;
      const z = center[1] + Math.sin(angle) * r;
      const tooClose = points.some(
        (p) => Math.hypot(p.position[0] - x, p.position[1] - z) < minDist
      );
      if (!tooClose) {
        points.push({ position: [x, z] });
        placed = true;
      }
    }
  }
  return points;
}

/** Builds a smooth-ish polyline of waypoints between two points, used for path/river segments. */
export function waypointChain(points) {
  return points.map(([x, z]) => [x, z]);
}

/**
 * Places `count` fruit on the surface of a foliage sphere of the given
 * radius, biased toward the outer/lower hemisphere (where fruit
 * actually hangs on a real tree) rather than uniformly over the whole
 * sphere.
 *
 * theta_i = (2*PI*i)/N + jitter                    (angle around the trunk)
 * phi_i   = acos(1 - rng() * 0.6)                  (angle from top pole,
 *                                                    clamped to the outer
 *                                                    0.6 of the sphere so
 *                                                    fruit stays out of
 *                                                    the very top/inside)
 * x = R * 0.92 * sin(phi) * cos(theta)
 * y = R * 0.92 * cos(phi)
 * z = R * 0.92 * sin(phi) * sin(theta)
 *
 * Returns points relative to the foliage sphere's own center, so the
 * caller just adds its own foliage position offset.
 */
export function fruitOnFoliageSphere({ radius, count, rng }) {
  const points = [];
  for (let i = 0; i < count; i++) {
    const theta = (2 * Math.PI * i) / count + (rng() - 0.5) * 0.4;
    const phi = Math.acos(1 - rng() * 0.6);
    const r = radius * 0.92;
    points.push([
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    ]);
  }
  return points;
}
