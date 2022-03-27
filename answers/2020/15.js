import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 15, 536, 24065124);

    this.exampleInput({ input: '0,3,6', part1: 436, part2: 175594 });
    this.exampleInput({ input: '1,3,2', part1: 1, part2: 2578 });
    this.exampleInput({ input: '2,1,3', part1: 10, part2: 3544142 });
    this.exampleInput({ input: '1,2,3', part1: 27, part2: 261214 });
    this.exampleInput({ input: '2,3,1', part1: 78, part2: 6895259 });
    this.exampleInput({ input: '3,2,1', part1: 438, part2: 18 });
    this.exampleInput({ input: '3,1,2', part1: 1836, part2: 362 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return ',';
  }

  play(input, turns) {
    const history = new Array(turns).fill(undefined);
    input.slice(0, -1).forEach((n, i) => {
      history[n] = i;
    });
    let prev = input[input.length - 1];
    for (let i = 0; i < turns - input.length; i += 1) {
      const next = history[prev] !== undefined ? i - 1 + input.length - history[prev] : 0;
      history[prev] = i + input.length - 1;
      prev = next;
    }
    return prev
  }

  part1(input) {
    return this.play(input, 2020);
  }

  part2(input) {
    return this.play(input, 30000000);
  }
}
