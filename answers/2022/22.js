import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

class GridSpace extends Vector {
  constructor(type, neighbours, ...points) {
    super(...points);
    this.type = type;
    this.neighbours = neighbours;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2022, 22, 155060, 3479);

    this.exampleInput({ filename: '22a', part1: 6032, Xpart2: 5031 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      map: Parsers.GRID,
      route: Parsers.SINGLE_LINE.withMappedProps({ parseLine: 'parseRoute' })
    };
  }

  parserGroup(line) {
    return /^\d/.test(line) ? 'route' : 'map';
  }

  parseRoute(line) {
    return line.replace(/([LR])/g, '$1,').split(',').map((step) => {
      const [, steps, turn] = /(\d+)(.?)/.exec(step);
      return { steps, turn };
    });
  }

  step({ grid, position, orientation }) {
    const nextStep = position.neighbours[orientation];
    const next = grid[nextStep.index];
    if (next.type === '#') return { position, orientation };
    return { position: next, orientation: nextStep.orientation || orientation };
  }

  turn({ position, orientation }, direction) {
    if (!direction) return { position, orientation };
    switch (orientation) {
      case 'right':
        return { position, orientation: direction === 'R' ? 'down' : 'up' };
      case 'down':
        return { position, orientation: direction === 'R' ? 'left' : 'right' };
      case 'left':
        return { position, orientation: direction === 'R' ? 'up' : 'down' };
      case 'up':
        return { position, orientation: direction === 'R' ? 'right' : 'left' };
    }
  }

  route({ grid, route }) {
    const { position: endPosition, orientation: endOrientation } = route
      .reduce(({ position, orientation }, { steps, turn }) => {
        const newPosition = Array.from({ length: steps })
          .reduce((po) => this.step({ grid, ...po }), { position, orientation });
        return this.turn(newPosition, turn);
      }, { position: grid.find(Boolean), orientation: 'right' });


    const row = endPosition.y + 1;
    const col = endPosition.x + 1;
    const endPos = ['right', 'down', 'left', 'up'].findIndex((it) => it === endOrientation);

    return ((row) * 1000) + ((col) * 4) + endPos;
  }

  getFace(x, y) {
    if (y < 50) return x < 100 ? 'A' : 'B';
    if (y < 100) return 'C';
    if (y < 150) return x < 50 ? 'D' : 'E';
    return 'F';
  }

  // EWWWWWWWW...
  getLeft({ ix, x, y, face, width, height, grid }) {
    if (x === 0 || grid[ix - 1] === ' ') {
      if (face === 'A') return { index: (width * (149 - y)), orientation: 'right' };
      if (face === 'C') return { index: (width * 100) + y - 50, orientation: 'down' };
      if (face === 'D') return { index: (width * (149 - y)) + 50, orientation: 'right' };
      if (face === 'F') return { index: y - 100, orientation: 'down' };
    }
    return { index: Array.from({ length: width - 1 }).map((_, i) => i + 1).map((i) => (y * width) + ((ix + (i * (width - 1))) % width)).find((i) => grid[i] !== ' ') };
  }

  getRight({ ix, x, y, face, width, height, grid }) {
    if (x === width - 1 || grid[ix + 1] === ' ') {
      if (face === 'B') return { index: (width * (149 - y)) + 99, orientation: 'left' };
      if (face === 'C') return { index: (width * 49) + y + 50, orientation: 'up' };
      if (face === 'E') return { index: (width * (149 - y)) + 149, orientation: 'left' };
      if (face === 'F') return { index: (width * 149) + y - 100, orientation: 'up' };
    }
    return { index: Array.from({ length: width - 1 }).map((_, i) => i + 1).map((i) => (y * width) + ((ix + i) % width)).find((i) => grid[i] !== ' ') };
  }

  getUp({ ix, x, y, face, width, height, grid }) {
    if (y === 0 || grid[ix - width] === ' ') {
      if (face === 'A') return { index: width * (x + 100), orientation: 'right' };
      if (face === 'B') return { index: (width * 199) + x - 100 };
      if (face === 'D') return { index: (width * (x + 50)) + 50, orientation: 'right' };
    }
    return { index: Array.from({ length: height - 1 }).map((_, i) => i + 1).map((i) => (ix + (i * (grid.length - width))) % grid.length).find((i) => grid[i] !== ' ') };
  }

  getDown({ ix, x, y, face, width, height, grid }) {
    if (y === 199 || grid[ix + width] === ' ') {
      if (face === 'B') return { index: (width * (x - 50)) + 99, orientation: 'left' };
      if (face === 'E') return { index: (width * (x + 100)) + 49, orientation: 'left' };
      if (face === 'F') return { index: x + 100 };
    }

    return { index: Array.from({ length: height - 1 }).map((_, i) => i + 1).map((i) => (ix + (i * width)) % grid.length).find((i) => grid[i] !== ' ') };
  }

  part1({ map: { grid, width, height }, route }) {
    const gridWithNeighbours = grid.map((value, ix) => {
      if (value === ' ') return undefined;
      const x = ix % width;
      const y = Math.floor(ix / width);

      const left = this.getLeft({ ix, x, y, width, height, grid });
      const right = this.getRight({ ix, x, y, undefined, width, height, grid });
      const up = this.getUp({ ix, x, y, undefined, width, height, grid });
      const down = this.getDown({ ix, x, y, undefined, width, height, grid });

      return new GridSpace(value, { left, right, up, down }, x, y);
    });

    return this.route({ grid: gridWithNeighbours, route });
  }

  part2({ map: { grid, width, height }, route }) {
    const gridWithNeighbours = grid.map((value, ix) => {
      if (value === ' ') return undefined;
      const x = ix % width;
      const y = Math.floor(ix / width);

      const face = this.getFace(x, y);
      const left = this.getLeft({ ix, x, y, face, width, height, grid });
      const right = this.getRight({ ix, x, y, face, width, height, grid });
      const up = this.getUp({ ix, x, y, face, width, height, grid });
      const down = this.getDown({ ix, x, y, face, width, height, grid });

      return new GridSpace(value, { left, right, up, down }, x, y);
    });

    return this.route({ grid: gridWithNeighbours, route });
  }
}
