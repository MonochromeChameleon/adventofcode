import { IntcodeQuestion } from './intcode/intcode-question.js';
import { permutations } from '../../utils/array-utils.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 7, 880726, 4931744);

    this.exampleInput({ input: '3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0', part1: 43210 });
    this.exampleInput({
      input: '3,23,3,24,1002,24,10,24,1002,23,-1,23,101,5,23,23,1,24,23,23,4,23,99,0,0',
      part1: 54321,
    });
    this.exampleInput({
      input: '3,31,3,32,1002,32,10,32,1001,31,-2,31,1007,31,0,33,1002,33,7,33,1,33,31,31,1,32,31,31,4,31,99,0,0,0',
      part1: 65210,
    });
    this.exampleInput({
      input: '3,26,1001,26,-4,26,3,27,1002,27,2,27,1,27,26,27,4,27,1001,28,-1,28,1005,28,6,99,0,0,5',
      part2: 139629729,
    });
    this.exampleInput({
      input:
        '3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10',
      part2: 18216,
    });
  }

  feedback(amplifiers, phases, input) {
    const [amp, ...others] = amplifiers;
    const [phase, ...rest] = phases;

    const params = [input.output];
    if (amp.index === 0) amp.next(phase);
    const { output } = amp.runToNextOutput(...params);

    if (amp.terminated && !others.length) {
      return output;
    }
    if (amp.terminated) {
      return this.feedback(others, rest, amp);
    }
    return this.feedback([...others, amp], [...rest, phase], amp);
  }

  applyFeedback(phases) {
    const amplifiers = phases.map(() => this.newIntcode());
    return this.feedback(amplifiers, phases, { output: 0 });
  }

  calculate(...phases) {
    return permutations(phases)
      .map((ps) => this.applyFeedback(ps))
      .sort((a, b) => a - b)
      .pop();
  }

  part1() {
    return this.calculate(0, 1, 2, 3, 4);
  }

  part2() {
    return this.calculate(5, 6, 7, 8, 9);
  }
}
