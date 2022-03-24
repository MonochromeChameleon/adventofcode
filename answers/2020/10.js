import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 10, 3034);

    this.exampleInput({ part1: 35, part2: 8 });
    this.exampleInput({ part1: 220, part2: 19208 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  part1(input) {
    const [one,, three] = [0, ...input].sort((a, b) => a - b).reduce((values, inp, ix, all) => {
      const next = all[ix + 1] || inp + 3;
      values[(next - inp) - 1] += 1;
      return values;
    }, [0, 0, 0]);
    return one * three;
  }

  part2(input) {
    return input.reduce((a, b) => a + b, 0);
  }
}
