import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 25, 3286137);

    this.exampleInput({ input: [5764801, 17807724], part1: 14897079 });
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  loop(value, subjectNumber = 7) {
    return (value * subjectNumber) % 20201227;
  }

  findLoop(targetValue) {
    let value = 1;
    let loopSize = 0;
    while (value !== targetValue) {
      value = this.loop(value);
      loopSize += 1;
    }
    return loopSize;
  }

  part1([door, card]) {
    const doorLoop = this.findLoop(door);

    return Array.from({ length: doorLoop }).reduce((v) => this.loop(v, card), 1);
  }
}
