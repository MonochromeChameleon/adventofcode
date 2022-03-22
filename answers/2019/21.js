import { IntcodeQuestion } from './intcode/intcode-question.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 21, 19347995, 1141826552);
    this.wip = true;
  }

  runProgram(intcode, program) {
    program
      .split('')
      .map((c) => c.charCodeAt(0))
      .forEach((c) => intcode.input(c));
    intcode.run();

    console.log(intcode.outArray.map((c) => String.fromCharCode(c)).join('')); // eslint-disable-line no-console
    return intcode.output;
  }

  part1(intcode) {
    const program = ['NOT C J', 'AND D J', 'NOT A T', 'OR T J', 'WALK', ''].join('\n');
    return this.runProgram(intcode, program);
  }

  part2(intcode) {
    const program = [
      'NOT C J',
      'AND D J',
      'AND H J',
      'NOT B T',
      'AND D T',
      'OR T J',
      'NOT A T',
      'OR T J',
      'RUN',
      '',
    ].join('\n');
    return this.runProgram(intcode, program);
  }
}
