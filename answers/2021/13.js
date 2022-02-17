import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 13, 807, 1945558963349);

    this.exampleInput({ part1: 17, part2: 113 });
  }

  applyFold({ x, y }, { axis, value }) {
    if (axis === 'x') {
      return { x: value - Math.abs(x - value), y };
    }
    return { x, y: value - Math.abs(y - value) };
  }

  fold(dots, fold) {
    const newDots = dots.map((dot) => this.applyFold(dot, fold));
    return newDots.filter((dot, index) => {
      const findex = newDots.findIndex(({ x, y }) => x === dot.x && y === dot.y);
      return findex === index;
    });
  }

  parseDot(line) {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
  }

  parseFold(line) {
    const [, axis, value] = /fold along ([xy])=(\d+)/.exec(line);
    return { axis, value: Number(value) };
  }

  parseInput(lines) {
    const dots = lines.filter((line) => !/^fold/.test(line)).map(this.parseDot);
    const folds = lines.filter((line) => /^fold/.test(line)).map(this.parseFold);
    return { dots, folds };
  }

  part1({ dots, folds: [fold] }) {
    const newDots = this.fold(dots, fold);
    return newDots.length;
  }

  part2({ dots, folds }) {
    const final = folds.reduce((newDots, fold) => this.fold(newDots, fold), dots);
    const maxX = final.reduce((max, dot) => Math.max(max, dot.x), 0);
    const maxY = final.reduce((max, dot) => Math.max(max, dot.y), 0);

    const grid = new Array(maxY + 1).fill(' ').map(() => new Array(maxX + 1).fill(' '));
    final.forEach(({ x, y }) => {
      grid[y][x] = 'X';
    });
    console.log(grid.map((line) => line.join('')).join('\n')); // eslint-disable-line no-console

    const binaryGrid = new Array(maxY + 1).fill(0).map(() => new Array(maxX + 1).fill(0));
    final.forEach(({ x, y }) => {
      binaryGrid[y][x] = 1;
    });
    return binaryGrid.map((line) => parseInt(line.join(''), 2)).reduce((a, b) => a + b);
  }
}
