import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { compose } from '../../utils/compose.js';

const div3 = (val) => val / 3;
const floor = Math.floor;
const sub2 = (val) => val - 2;

const calc = compose(div3, floor, sub2);
const moduleAndFuel = (val) => (calc(val) > 0 ? [val, ...moduleAndFuel(calc(val))] : [val]);

export class Question extends QuestionBase {
  constructor() {
    super(2019, 1, 3305115, 4954799);

    this.exampleInput({ input: 12, part1: 2, part2: 2 });
    this.exampleInput({ input: 14, part1: 2, part2: 2 });
    this.exampleInput({ input: 1969, part1: 654, part2: 966 });
    this.exampleInput({ input: 100756, part1: 33583, part2: 50346 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  part1(input) {
    return input.map(calc).reduce((sum, it) => sum + it, 0);
  }

  part2(input) {
    return input
      .map(moduleAndFuel)
      .map(([, ...f]) => f)
      .map((arr) => arr.reduce((sum, it) => sum + it, 0))
      .reduce((sum, it) => sum + it, 0);
  }
}
