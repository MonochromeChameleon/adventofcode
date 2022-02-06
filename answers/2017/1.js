import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 1, 1158, 1132);

    this.exampleInput({ input: '1122', part1: 3 });
    this.exampleInput({ input: '1111', part1: 4 });
    this.exampleInput({ input: '1234', part1: 0 });
    this.exampleInput({ input: '91212129', part1: 9 });
    this.exampleInput({ input: '1212', part2: 6 });
    this.exampleInput({ input: '1221', part2: 0 });
    this.exampleInput({ input: '123425', part2: 4 });
    this.exampleInput({ input: '123123', part2: 12 });
    this.exampleInput({ input: '12131415', part2: 4 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  part1(input) {
    return input.reduce((sum, i, ix) => {
      const next = ix < input.length - 1 ? input[ix + 1] : input[0];
      return i === next ? sum + i : sum;
    }, 0);
  }

  part2(input) {
    return input.reduce((sum, i, ix) => {
      const next = (ix + input.length / 2) % input.length;
      return i === input[next] ? sum + i : sum;
    }, 0);
  }
}
