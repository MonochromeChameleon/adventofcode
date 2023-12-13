import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 11, 9623138, 726820169514);

    this.exampleInput({ part1: 374 });
    this.exampleInput({ filename: '11a', part2: 1030 }, 10);
    this.exampleInput({ filename: '11a', part2: 8410 }, 100);
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  doTheThing(input, expansionRate = 2) {
    const emptyColumns = input[0]
      .map((c, ix) => (input.every((i) => i[ix] === '.') ? ix : undefined))
      .filter((c) => c !== undefined);
    const emptyRows = input.map((r, ix) => (r.every((c) => c === '.') ? ix : undefined)).filter((c) => c !== undefined);
    const galaxies = input
      .flatMap((row, y) =>
        row.map((c, x) => {
          if (c !== '#') return undefined;
          const xExpansion = (expansionRate - 1) * emptyColumns.filter((cc) => cc < x).length;
          const yExpansion = (expansionRate - 1) * emptyRows.filter((cc) => cc < y).length;
          return new Vector(x + xExpansion, y + yExpansion);
        }),
      )
      .filter(Boolean);
    const pairs = galaxies.reduce((out, g, ix) => [...out, ...galaxies.slice(ix + 1).map((gg) => gg.subtract(g))], []);
    return pairs.map((p) => p.manhattan).reduce((a, b) => a + b);
  }

  part1(input) {
    return this.doTheThing(input);
  }

  part2(input, expansionRate = 1_000_000) {
    return this.doTheThing(input, expansionRate);
  }
}
