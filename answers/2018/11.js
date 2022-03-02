import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 11, '243,68', '236,252,12');

    this.exampleInput({ input: 18, part1: '33,45', part2: '90,269,16' });
    this.exampleInput({ input: 42, part1: '21,61', part2: '232,251,12' });
  }

  get parser() {
    return Parsers.SINGLE_NUMBER;
  }

  getPowerLevel(ix, serial) {
    const x = ix % 300;
    const y = ~~(ix / 300);

    return ~~(((((x + 10) * y + serial) * (x + 10)) % 1000) / 100) - 5;
  }

  getPowerSlice(grid, x, y, ix, size) {
    const indices = [
        ...Array.from({ length: size }, (_, i) => (ix + size - 1) + (i * 300)),
        ...Array.from({ length: size - 1 }, (_, i) => ix + ((size - 1) * 300) + i),
    ];

    return indices.reduce((acc, ix) => acc + grid[ix], 0);
  }

  calculatePowerCell(grid, x, y, ix, size = 3) {
    if (x > 300 - size || y > 300 - size) return 0;
    return Array.from({ length: size }, (_, i) => this.getPowerSlice(grid, x, y, ix, i + 1)).reduce((acc, val) => acc + val, 0);
  }

  calculateBestPowerCell(grid, x, y, ix) {
    const best = { power: 0, size: 0, x, y };
    let previous = 0;
    for (let size = 1; size <= 300 - Math.max(x, y); size += 1) {
      previous += this.getPowerSlice(grid, x, y, ix, size);
      if (previous > best.power) {
        best.power = previous;
        best.size = size;
      }
      if (previous < 0) return best;
    }
    return best;
  }

  postParse(input) {
    return Array.from({ length: 300 * 300 }, (_, i) => this.getPowerLevel(i + 1, input));
  }

  part1(grid) {
    const { x, y } = grid.reduce((best, _, i) => {
      const { power } = best;
      const x = i % 300;
      const y = ~~(i / 300);
      const thisPower = this.calculatePowerCell(grid, x, y, i);
      return thisPower > power ? { x, y, power: thisPower } : best;
    }, { power: 0, x: -1, y: -1 });

    return `${x + 1},${y}`;
  }

  part2(grid) {
    const { x, y, size } = grid.reduce((best, _, i) => {
      const { power: bestPower } = best;
      const x = i % 300;
      const y = ~~(i / 300);
      const { power, size } = this.calculateBestPowerCell(grid, x, y, i);
      return power > bestPower ? { x, y, power, size } : best;
    }, { power: 0, size: 0, index: -1 });

    // Solve OBOES the nasty way
    const options = [
      { x: x - 1, y: y - 1, size: size - 1 },
      { x: x - 1, y: y - 1, size },
      { x: x - 1, y: y - 1, size: size + 1 },
      { x: x - 1, y, size: size - 1 },
      { x: x - 1, y, size },
      { x: x - 1, y, size: size + 1 },
      { x: x - 1, y: y + 1, size: size - 1 },
      { x: x - 1, y: y + 1, size },
      { x: x - 1, y: y + 1, size: size + 1 },
      { x, y: y - 1, size: size - 1 },
      { x, y: y - 1, size },
      { x, y: y - 1, size: size + 1 },
      { x, y, size: size - 1 },
      { x, y, size },
      { x, y, size: size + 1 },
      { x, y: y + 1, size: size - 1 },
      { x, y: y + 1, size },
      { x, y: y + 1, size: size + 1 },
      { x: x + 1, y: y - 1, size: size - 1 },
      { x: x + 1, y: y - 1, size },
      { x: x + 1, y: y - 1, size: size + 1 },
      { x: x + 1, y, size: size - 1 },
      { x: x + 1, y, size },
      { x: x + 1, y, size: size + 1 },
      { x: x + 1, y: y + 1, size: size - 1 },
      { x: x + 1, y: y + 1, size },
      { x: x + 1, y: y + 1, size: size + 1 },
    ];

    const results = options.map(({ x, y, size }) => this.calculatePowerCell(grid, x, y, x + (y * 300), size));
    const bestResult = results.reduce((best, result) => result > best ? result : best, 0);
    const bestIndex = results.indexOf(bestResult);
    const best = options[bestIndex];

    // Why is the x value STILL off by one?????
    return Object.values(best).map((v, ix) => ix ? v : v + 1).join(',');
  }
}
