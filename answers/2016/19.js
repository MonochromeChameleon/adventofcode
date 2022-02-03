import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 19, 1841611, 1423634);

    this.exampleInput({ input: 5, part1: 3, part2: 2 });
  }

  get parser() {
    return Parsers.SINGLE_NUMBER;
  }

  part1(input) {
    const pow2 = 2 ** Math.floor(Math.log2(input));
    const remainder = input - pow2;
    return 2 * remainder + 1;
  }

  part2(input) {
    let ii = 1;
    let something = 1;
    let somethingElse = 1;

    while (ii < input) {
      if (ii === something) {
        something = 1;
        somethingElse = ii;
      } else if (something < somethingElse) {
        something += 1;
      } else {
        something += 2;
      }
      ii += 1;
    }

    return something;

    /*
    let elves = Array.from({ length: input }).map((_, i) => i + 1);
    let ix = 0;
    while (elves.length > 1) {
      const tgt = (ix + ~~(elves.length / 2)) % elves.length;
      if (ix === elves.length - 1) {
        ix = 0;
      } else if (tgt > ix) {
        ix += 1;
      }
      if (tgt === 0) {
        elves = elves.slice(1);
      } else {
        elves = elves.slice(0, tgt).concat(elves.slice(tgt + 1));
      }
    }
    return elves[0]; */
  }
}
