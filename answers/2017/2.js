import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 2, 32020, 236);

    this.exampleInput({ part1: 18 });
    this.exampleInput({ part2: 9 });
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return /\s+/;
  }

  getMinMax(row) {
    return row.reduce(
      ({ max, min }, c) => ({
        max: Math.max(max, c),
        min: Math.min(min, c),
      }),
      { max: 0, min: Infinity }
    );
  }

  getWholeDivider(row) {
    return row.flatMap((c) => row.filter((d) => d !== c).map((d) => c / d)).find((v) => Number.isInteger(v));
  }

  part1(rows) {
    return rows.map(this.getMinMax).reduce((tot, { max, min }) => tot + max - min, 0);
  }

  part2(rows) {
    return rows.map(this.getWholeDivider).reduce((a, b) => a + b, 0);
  }
}
