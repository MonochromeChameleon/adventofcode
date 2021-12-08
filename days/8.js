import { QuestionBase } from '../utils/question-base.js';

export class Question extends QuestionBase {
  constructor(args) {
    super(8, 26, 390, 61229, 1011785, args);
  }

  parseLine(line) {
    const [signal, output] = line
      .split('|')
      .map((x) => x.trim())
      .map((x) => x.split(' '));

    return {
      signal: signal.map((it) => it.split('').sort()),
      output: output.map((it) => it.split('').sort().join('')),
    };
  }

  solveRow({ signal, output }) {
    const one = signal.find((it) => it.length === 2);
    const four = signal.find((it) => it.length === 4);
    const seven = signal.find((it) => it.length === 3);
    const eight = signal.find((it) => it.length === 7);
    const six = signal.find((it) => it.length === 6 && !one.every((line) => it.includes(line)));
    const five = signal.find((it) => it.length === 5 && it.every((line) => six.includes(line)));
    const nine = signal.find((it) => it.length === 6 && four.every((line) => it.includes(line)));
    const zero = signal.find((it) => it.length === 6 && it !== six && it !== nine);
    const two = signal.find((it) => it.length === 5 && !it.every((line) => nine.includes(line)));
    const three = signal.find((it) => it.length === 5 && it !== two && it !== five);

    const digits = {
      [one.join('')]: 1,
      [two.join('')]: 2,
      [three.join('')]: 3,
      [four.join('')]: 4,
      [five.join('')]: 5,
      [six.join('')]: 6,
      [seven.join('')]: 7,
      [eight.join('')]: 8,
      [nine.join('')]: 9,
      [zero.join('')]: 0,
    };

    return Number(output.map((it) => digits[it]).join(''));
  }

  part1(input) {
    return input.flatMap(({ output }) => output).filter((it) => [2, 3, 4, 7].includes(it.length)).length;
  }

  part2(input) {
    return input.map(this.solveRow).reduce((sum, it) => sum + it);
  }
}
