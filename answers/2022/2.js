import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 2, 12156, 10835);

    this.exampleInput({ input: ['A Y', 'B X', 'C Z'], part1: 15, part2: 12 });
  }

  parseLine(value) {
    const [them, me] = value.split(' ');
    const rpst = ['A', 'B', 'C'].indexOf(them);
    const rpsm = ['X', 'Y', 'Z'].indexOf(me);

    return { rpst, rpsm };
  }

  part1(input) {
    return input.map(({ rpst, rpsm }) => {
      const draw = rpst === rpsm;
      const win = (rpsm === (rpst + 1) % 3);

      return (rpsm + 1) + (draw ? 3 : 0) + (win ? 6 : 0);
    }).reduce((a, b) => a + b, 0);
  }

  part2(input) {
    return input.map(({ rpst, rpsm: rslt }) => {
      const rpsm = ((rslt === 1 ? rpst : (rslt === 0 ? rpst - 1 : rpst + 1)) + 3) % 3;
      return (rslt * 3) + rpsm + 1;
    }).reduce((a, b) => a + b, 0);
  }
}
