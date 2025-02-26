import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { GROUP } from '../../parsers/parsers.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 13, 25751, 108528956728655);

    this.exampleInput({ part1: 480 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupSize() {
    return 3;
  }

  parseGroup(lines) {
    const [a, b, prize] = lines.map((line) => {
      const [, , x, y] = /^([^:]+): X.(\d+), Y.(\d+)$/.exec(line).map(Number);
      return { x, y };
    });

    return { a, b, prize}
  }

  tokensToWin({ a, b, prize }) {
    const aaa = (prize.x - (b.x * prize.y / b.y)) / (a.x - (b.x * a.y / b.y));
    if (Math.abs(Math.round(aaa) - aaa) < 0.0001) { // Floating point errors EWWWW
      const bbb = (prize.x - (aaa * a.x)) / b.x;
      return (3 * aaa) + bbb;
    }

    return undefined;
  }

  part1(input) {
    return input.map((machine) => this.tokensToWin(machine)).filter(Boolean).reduce((a, b) => a + b, 0);
  }

  part2(input) {
    return input.map(({ a, b, prize: { x, y } }) => this.tokensToWin({ a, b, prize: { x: x + 10000000000000, y: y + 10000000000000 } })).filter(Boolean).reduce((a, b) => a + b, 0);
  }
}
