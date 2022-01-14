import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 8, 390, 1011785);

    this.exampleInput({ filename: 'testinputs/8', part1: 26, part2: 61229 });
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
    const [one, seven, four, a, b, c, d, e, f, eight] = signal.sort((a, b) => a.length - b.length);
    const fourNotOne = four.filter((line) => !one.includes(line));

    const three = [a, b, c].find((it) => one.every((line) => it.includes(line)));
    const five = [a, b, c].find((it) => it !== three && fourNotOne.every((line) => it.includes(line)));
    const two = [a, b, c].find((it) => it !== three && it !== five);

    const nine = [d, e, f].find((it) => four.every((line) => it.includes(line)));
    const zero = [d, e, f].find((it) => it !== nine && one.every((line) => it.includes(line)));
    const six = [d, e, f].find((it) => it !== nine && it !== zero);

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
