import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor (args) {
    super(9, 15, 491, 1134, 1075536, args);
  }

  parseLine(line) {
    return line.split('').map(Number);
  }

  part1 (input) {
    const minima = input.flatMap((line, y) => line.filter((point, x) => {
      const up = (input[y - 1] || [])[x];
      const left = line[x - 1];
      const right = line[x + 1];
      const down = (input[y + 1] || [])[x];

      return [up, left, down, right].every(it => it === undefined || it > point);
    }));

    return minima.reduce((sum, point) => sum + point, 0) + minima.length;
  }

  part2 (input) {
    const basins = [];
    const mapped = input[0].map(() => []);
    const combinations = [];

    input.forEach((line, y) => line.forEach((point, x) => {
      if (point !== 9) {
        const left = line[x - 1];
        const up = (input[y - 1] || [])[x];

        const isNew = [left, up].every(it => it === undefined || it === 9);
        if (isNew) {
          mapped[y][x] = basins.length;
          basins.push([`${x}:${y}`]);
          combinations.push(new Set());
        } else {
          const bLeft = mapped[y][x - 1];
          const bUp = (mapped[y - 1] || [])[x];

          const [basin, combine] = [bLeft, bUp].filter(it => it !== undefined).sort((a, b) => a - b);
          mapped[y][x] = basin;
          basins[basin].push(`${x}:${y}`);

          if (combine !== undefined && combine !== basin) {
            combinations[basin].add(combine);
          }
        }
      }
    }));

    combinations.reverse();

    combinations.forEach((c, cix) => c.forEach((tgt) => {
      basins[basins.length - cix - 1] = basins[basins.length - cix - 1].concat(basins[tgt]);
      basins[tgt] = [];
    }));

    const [big, medium, small] = basins.sort((a, b) => b.length - a.length);
    return big.length * medium.length * small.length;
  }
}
