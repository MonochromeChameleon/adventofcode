import { QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';
import { countBy } from '../../utils/count-by-value.js';
import { printGrid } from '../../utils/grid-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 14, 228421332, 7790);

    this.exampleInput({ part1: 12, part2: 2 }, 11, 7);
  }

  parseLine(line) {
    const [, px, py, vx, vy] = /^p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)$/.exec(line).map(Number);

    return { position: new Vector(px, py), velocity: new Vector(vx, vy) };
  }

  part1(robots, width = 101, height = 103) {
    const MULTIPLY_100 = [new Vector(100, 0), new Vector(0, 100)];
    const after = robots
      .map(({ position, velocity: { x, y } }) => ({
        position,
        velocity: new Vector((x + width) % width, (y + height) % height)
      }))
      .map(({ position, velocity }) => position.addBounded(velocity.multiply(...MULTIPLY_100), new Vector(width, height)));
    const midX = (width - 1) / 2;
    const midY = (height - 1) / 2;
    const { tl, tr, bl, br, mid } = countBy(after, (({ x, y }) => {
      if (x < midX && y < midY) return 'tl';
      if (x > midX && y < midY) return 'tr';
      if (x < midX && y > midY) return 'bl';
      if (x > midX && y > midY) return 'br';
      return 'mid';
    }));
    return tl * tr * bl * br;
  }

  isChristmasTree(robots, width, height, i) {
    const grid = new Array(width * height).fill('.');
    robots.forEach(({ position: { x, y } }) => {
      grid[(y * width) + x] = '#';
    });
    const centreLine = Array.from({ length: height }, (_, ix) => ix * width + Math.floor(width / 2));
    const tolerance = 1;
    const tolerant = robots.filter(({ position: { x, y } }, ix) => robots.some(({ position: { x: cx, y: cy } }, ci) => ix !== ci && Math.abs(cx - x) <= tolerance && Math.abs(cy - y) <= tolerance));

    // Half the robots are next to another robot
    if (tolerant.length > 0.7 * robots.length) {
      console.log(`\n========= ${i} =========\n\n`);
      printGrid(grid, width);
      console.log(`\n\n========= ${i} =========\n`);
      return true;
    }

    return false;
  }

  async part2(input, width = 101, height = 103) {
    const bounds = new Vector(width, height);
    let robots = input.map(({ position, velocity: { x, y } }) => ({
      position,
      velocity: new Vector((x + width) % width, (y + height) % height)
    }));

    let i = 0;
    while (!this.isChristmasTree(robots, width, height, i) && i < width * height) {
      i += 1;
      robots = robots.map(({ position, velocity }) => ({ position: position.addBounded(velocity, bounds), velocity }));
    }

    return i;
  }
}
