import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 9, 3780860499, 33343);

    this.exampleInput({ input: '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99', part1: '109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99' });
    this.exampleInput({ input: '1102,34915192,34915192,7,4,7,99,0', part1: 1219070632396864 });
    this.exampleInput({ input: '104,1125899906842624,99', part1: 1125899906842624 });
  }

  part1(input) {
    return input.reset().run(1).outArray.reduce((acc, next) => acc + ',' + next);
  }

  part2() {
    return this.calculate(2);
  }
}
