import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 10, 3034, 259172170858496);

    this.exampleInput({ part1: 35, part2: 8 });
    this.exampleInput({ part1: 220, part2: 19208 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  get sort() {
    return (a, b) => a - b;
  }

  part1(input) {
    const [one,, three] = [0, ...input].reduce((values, inp, ix, all) => {
      const next = all[ix + 1] || inp + 3;
      values[(next - inp) - 1] += 1;
      return values;
    }, [0, 0, 0]);
    return one * three;
  }

  part2(input) {
    const max = input[input.length - 1];
    const permutations = [...input, max + 3].reduce((sofar, next) => {
      const total = [next - 1, next - 2, next - 3].map((n) => sofar[n] || 0).reduce((a, b) => a + b);
      return { ...sofar, [next]: total };
    }, { 0: 1 });

    return permutations[max];
  }
}
