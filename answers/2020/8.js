import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 8, 1614, 1260);

    this.exampleInput({ part1: 5, part2: 8 }, 7);
  }

  get parser() {
    return Parsers.INSTRUCTIONS;
  }

  nop() {

  }

  acc(delta) {
    this.accumulator += delta;
  }

  jmp(delta) {
    this.pointer += delta - 1;
  }

  part1(input) {
    const executed = [];
    const breakFn = ({ pointer }) => {
      if (executed.includes(pointer)) return true;
      executed.push(pointer);
      return false;
    };
    const { accumulator } = this.execute(input, { accumulator: 0 }, { breakFn });
    return accumulator;
  }

  part2(input, lineToChange = 247) {
    const instruction = input[lineToChange];
    instruction.instruction = instruction.instruction === 'jmp' ? 'nop' : 'jmp';
    const { accumulator } = this.execute(input, { accumulator: 0 });
    return accumulator;
  }
}
