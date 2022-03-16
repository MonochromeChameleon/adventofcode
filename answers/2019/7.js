import { IntcodeQuestion } from './intcode/intcode-question.js';
import { permutations } from '../../utils/array-utils.js';

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 7, 880726, 4931744);
    this.wip = true;
  }

  feedback(amplifiers, phases, input) {
    const [amp, ...others] = amplifiers;
    const [phase, ...rest] = phases;

    const params = [input.output];
    if (amp.index === 0) amp.next(phase);
    const { output } = amp.toOutput(...params);

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
