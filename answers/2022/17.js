import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const LEFT = new Vector(-1, 0);
const RIGHT = new Vector(1, 0);
const DOWN = new Vector(0, -1);

const ROCKS = [
  [
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 5, y: 4 },
  ],
  [
    { x: 2, y: 5 },
    { x: 3, y: 4 },
    { x: 3, y: 5 },
    { x: 3, y: 6 },
    { x: 4, y: 5 },
  ],
  [
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
    { x: 4, y: 5 },
    { x: 4, y: 6 },
  ],
  [
    { x: 2, y: 7 },
    { x: 2, y: 6 },
    { x: 2, y: 5 },
    { x: 2, y: 4 },
  ],
  [
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 2, y: 5 },
    { x: 3, y: 5 },
  ],
];

class Rock {
  constructor(height, ...shape) {
    this.shape = shape.map(({ x, y }) => new Vector(x, y + height));
    this.landed = false;
  }

  move(dir) {
    this.shape = this.shape.map((s) => s.add(dir));
  }
}

class Grid {
  constructor(width, windDirections) {
    this.cells = Array.from({ length: width }, () => [0]);
    this.rocks = 0;
    this.windex = 0;
    this.windDirections = windDirections;
  }

  get height() {
    return this.cells.map((c) => c[c.length - 1]).reduce((a, b) => Math.max(a, b));
  }

  blow(rock) {
    const direction = this.windDirections[this.windex];
    this.windex = (this.windex + 1) % this.windDirections.length;
    if (direction === '<') {
      if (rock.shape.some(({ x }) => x === 0)) return;
      if (rock.shape.some(({ x, y }) => this.cells[x - 1].includes(y))) return;
      rock.move(LEFT);
    }
    if (direction === '>') {
      if (rock.shape.some(({ x }) => x === 6)) return;
      if (rock.shape.some(({ x, y }) => this.cells[x + 1].includes(y))) return;
      rock.move(RIGHT);
    }
  }

  down(rock) {
    if (rock.shape.some(({ x, y }) => this.cells[x].includes(y - 1))) {
      this.rocks += 1;
      rock.landed = true;
      rock.shape.forEach(({ x, y }) => {
        this.cells[x] = [...this.cells[x], y].sort((a, b) => a - b);
      });
    } else {
      rock.move(DOWN);
    }
  }

  dropNextRock() {
    const rock = new Rock(this.height, ...ROCKS[this.rocks % ROCKS.length]);
    while (!rock.landed) {
      this.blow(rock);
      this.down(rock);
    }
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2022, 17, 3109, 1541449275365);

    this.exampleInput({ input: '>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>', part1: 3068, part2: 1514285714288 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT;
  }

  postParse(input, width = 7) {
    return new Grid(width, input);
  }

  part1(grid, rocks = 2022) {
    while (grid.rocks < rocks) grid.dropNextRock();
    return grid.height;
  }

  part2(grid, rocks = 1000000000000) {
    const cycles = {};
    while (true) {
      grid.dropNextRock();
      const key = `${grid.windex}:${grid.rocks % ROCKS.length}`;
      if (key in cycles) {
        const { height: previousHeight, rocks: previousRocks } = cycles[key];
        const numRepeats = Math.floor((rocks - previousRocks) / (grid.rocks - previousRocks));
        const repeatHeight = (numRepeats - 1) * (grid.height - previousHeight);
        let overflow = (rocks - previousRocks) % (grid.rocks - previousRocks);
        while (overflow > 0) {
          grid.dropNextRock();
          overflow -= 1;
        }

        return grid.height + repeatHeight;
      }
      cycles[key] = { height: grid.height, rocks: grid.rocks };
    }
  }
}
