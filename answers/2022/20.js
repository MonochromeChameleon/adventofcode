import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 20, 2827, 7834270093909);

    this.exampleInput({ input: [1, 2, -3, 3, -2, 0, 4], part1: 3, part2: 1623178306 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  mix(numbers, rounds = 1) {
    return Array.from({ length: rounds })
      .reduce(
        (round) =>
          numbers.reduce((out, n, ix) => {
            const iix = out.findIndex((o) => o === ix);
            const before = out.slice(0, iix);
            const after = iix === out.length - 1 ? [] : out.slice(iix + 1);

            const joined = before.concat(after);
            const newIndex = (iix + numbers.length + n - 1) % (numbers.length - 1);
            joined.splice(newIndex || numbers.length - 1, 0, ix);
            return joined;
          }, round),
        Array.from(numbers, (_, ix) => ix),
      )
      .map((ix) => numbers[ix]);
  }

  part1(input, rounds = 1) {
    const mixed = this.mix(input, rounds);
    const zero = mixed.findIndex((m) => m === 0);
    const coordinates = [1000, 2000, 3000].map((c) => (c + zero) % input.length).map((c) => mixed[c]);
    return coordinates.reduce((a, b) => a + b);
  }

  part2(input, multiplier = 811589153, rounds = 10) {
    return this.part1(
      input.map((i) => i * multiplier),
      rounds,
    );
  }
}
