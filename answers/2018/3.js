import { QuestionBase } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 3, 116140, 574);

    this.exampleInput({ part1: 4, part2: 3 });
  }

  parseLine(line) {
    const [, id, l, t, w, h] = line.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)$/).map(Number);
    const cells = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (__, x) => `${x + l}:${y + t}`)).flat(
      Infinity,
    );
    return { id, l, t, w, h, cells };
  }

  getCounts(input) {
    if (!this._counts) {
      const allCells = input.flatMap(({ cells }) => cells);
      this._counts = countByValue(allCells);
    }
    return this._counts;
  }

  part1(input) {
    const allCells = input.flatMap(({ cells }) => cells);
    const counts = countByValue(allCells);
    return Object.values(counts).filter((c) => c > 1).length;
  }

  part2(input) {
    const counts = this.getCounts(input);
    const { id } = input.find(({ cells }) => cells.every((c) => counts[c] === 1));
    return id;
  }
}
