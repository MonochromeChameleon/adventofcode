import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';
import { letterSlice, isLetter, getLetter } from '../../utils/grid-letters.js';

class MovingPoint extends Vector {
  constructor([x, y, vx, vy]) {
    super(x, y);
    this.velocity = new Vector(vx, vy);
    this.moves = 0;
  }

  move() {
    const { x, y } = this.add(this.velocity);
    this.x = x;
    this.y = y;
    this.moves += 1;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 10, 'KBJHEZCB', 10369);

    this.exampleInput({ part1: 'HI', part2: 3 });
  }

  get parser() {
    return Parsers.DAISY_CHAIN;
  }

  get parsers() {
    return {
      regex: Parsers.REGEX,
      constructor: Parsers.MULTI_LINE_CONSTRUCTOR,
    };
  }

  get regex() {
    return /^position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>$/;
  }

  get inputConstructor() {
    return MovingPoint;
  }

  getLimits(points) {
    return points.reduce(
      ({ minX, maxX, minY, maxY }, { x, y }) => ({
        minX: Math.min(minX, x),
        maxX: Math.max(maxX, x),
        minY: Math.min(minY, y),
        maxY: Math.max(maxY, y),
      }),
      {
        minX: Number.MAX_SAFE_INTEGER,
        maxX: Number.MIN_SAFE_INTEGER,
        minY: Number.MAX_SAFE_INTEGER,
        maxY: Number.MIN_SAFE_INTEGER,
      },
    );
  }

  getWidth(points) {
    const { minX, maxX } = this.getLimits(points);
    return maxX - minX;
  }

  toGrid(points) {
    const { minX, maxX, minY, maxY } = this.getLimits(points);

    const width = Math.min(1 + maxX - minX, 1000);
    const height = Math.min(1 + maxY - minY, 100);

    const gridSize = width * height;

    const grid = new Array(gridSize).fill('.');

    points.forEach(({ x, y }) => {
      const ix = Math.min((y - minY) * width + (x - minX), 100000);
      grid[ix] = '#';
    });

    return { grid, width, height };
  }

  hasLetters(input) {
    const { grid, width } = this.toGrid(input);
    const slices = letterSlice(grid, width);
    return slices.find((slice) => isLetter(slice));
  }

  getLetters(input) {
    const { grid, width } = this.toGrid(input);
    const slices = letterSlice(grid, width);

    return slices.map((slice) => getLetter(slice)).join('');
  }

  part1(points) {
    while (this.getWidth(points) > 100) points.forEach((p) => p.move());
    while (!this.hasLetters(points)) points.forEach((p) => p.move());
    return this.getLetters(points);
  }

  part2([first]) {
    return first.moves;
  }
}
