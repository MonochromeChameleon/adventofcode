import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 17, 772, 42729050);

    this.exampleInput({ input: 3, part1: 638 });
  }

  get parser() {
    return Parsers.SINGLE_NUMBER;
  }

  stuff(stepSize, limit) {
    const { arr: final } = Array.from({ length: limit }).reduce(
      ({ position, arr }, _, i) => {
        const newPosition = (position + stepSize) % (i + 1);
        arr.splice(newPosition + 1, 0, i + 1);
        return { position: newPosition + 1, arr };
      },
      { position: 0, arr: [0] },
    );

    return final;
  }

  part1(stepSize) {
    const final = this.stuff(stepSize, 2017);
    const ix = final.indexOf(2017);
    return final[ix + 1];
  }

  part2(stepSize) {
    const { latest: final } = Array.from({ length: 50000000 }).reduce(
      ({ position, latest }, _, i) => {
        const newPosition = (position + stepSize) % (i + 1);
        return { position: newPosition + 1, latest: newPosition ? latest : i + 1 };
      },
      { position: 0, latest: 0 },
    );

    return final;
  }
}
