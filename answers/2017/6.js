import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 6, 7864, 1695);

    this.exampleInput({ input: ['0 2 7 0'], part1: 5, part2: 4 });
    this.states = [];
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return /\s+/;
  }

  redistribute() {
    const maxValue = this.currentState.reduce((a, b) => Math.max(a, b));
    const maxIndex = this.currentState.indexOf(maxValue);
    this.currentState[maxIndex] = 0;
    for (let i = 1; i <= maxValue; i += 1) {
      this.currentState[(maxIndex + i) % this.currentState.length] += 1;
    }
  }

  part1(input) {
    this.currentState = input.slice();
    while (!this.states.includes(this.currentState.join(','))) {
      this.states.push(this.currentState.join(','));
      this.redistribute();
    }
    return this.states.length;
  }

  part2() {
    const firstLoop = this.states.indexOf(this.currentState.join(','));
    return this.answers.part1 - firstLoop;
  }
}
