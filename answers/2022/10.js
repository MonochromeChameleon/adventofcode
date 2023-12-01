import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { printLetters } from '../../utils/grid-letters.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 10, 14160, 'RJERPEFC');

    this.exampleInput({ filename: '10a', part1: 13140 });
  }

  get parser() {
    return Parsers.FLAT_MAP;
  }

  parseLine(line) {
    if (line === 'noop') return 0;
    return [0, Number(line.replace(/^addx /, ''))];
  }

  postParse(cycles) {
    return [1, ...cycles.reduce((out, v) => [...out, out[out.length - 1] + v], [1])];
  }

  part1(input) {
    return [20, 60, 100, 140, 180, 220].map((x) => input[x] * x).reduce((a, b) => a + b, 0);
  }

  part2([, ...input]) {
    const pixels = input.map((v, ix) => (Math.abs(v - (ix % 40)) <= 1 ? '#' : ' '));
    printLetters(pixels, 40);
    return 'RJERPEFC';
  }
}
