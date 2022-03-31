import { Vector } from './vector.js';

const EAST = new Vector(1, -1, 0);
const SOUTH_EAST = new Vector(0, -1, 1);
const SOUTH_WEST = new Vector(-1, 0, 1);
const WEST = new Vector(-1, 1, 0);
const NORTH_WEST = new Vector(0, 1, -1);
const NORTH_EAST = new Vector(1, 0, -1);

const compass = [EAST, SOUTH_EAST, SOUTH_WEST, WEST, NORTH_WEST, NORTH_EAST];
const neighbours = (point) => compass.map((p) => p.add(point));

export const hexagonalSpace = {
  EAST,
  SOUTH_EAST,
  SOUTH_WEST,
  WEST,
  NORTH_WEST,
  NORTH_EAST,
  points: compass,
  neighbours,
};
