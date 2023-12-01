import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 18, 1987, 19984714);

    this.exampleInput({ input: '..^^.', part1: 6 }, 3);
    this.exampleInput({ input: '.^^.^.^^^^', part1: 38 }, 10);
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT_MAP;
  }

  parseValue(char) {
    return char === '.' ? 1 : 0;
  }

  nextRow(row) {
    return row.map((val, i) => {
      const left = i ? row[i - 1] : 1;
      const right = i < row.length - 1 ? row[i + 1] : 1;
      return left ^ right ^ 1;
    });
  }

  part1(firstRow, numRows = 40) {
    const result = Array.from({ length: numRows - 1 }).reduce(
      ({ row, count }) => {
        const nextRow = this.nextRow(row);
        const newCount = nextRow.reduce((a, b) => a + b, count);
        return { row: nextRow, count: newCount };
      },
      { row: firstRow, count: firstRow.reduce((a, b) => a + b) },
    );

    return result.count;
  }

  part2(input) {
    return this.part1(input, 400000);
  }
}
