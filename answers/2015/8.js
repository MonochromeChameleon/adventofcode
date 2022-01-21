import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 8, 1333, 2046);

    this.exampleInput({ filename: '8a', part1: 12, part2: 19 });
  }

  parseLine(line) {
    const short = line
      .slice(1, -1)
      .replaceAll(/\\"/g, 'X')
      .replaceAll(/\\\\/g, 'X')
      .replaceAll(/(\\x.{2})/g, 'X');

    const long = `"${line.replaceAll(/\\/g, '\\\\').replaceAll(/"/g, '\\"')}"`;
    return {
      code: line.length,
      memory: short.length,
      diff: line.length - short.length,
      enc: long.length - line.length,
    };
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  part1(input) {
    return input.reduce((sum, { diff }) => sum + diff, 0);
  }

  part2(input) {
    return input.reduce((sum, { enc }) => sum + enc, 0);
  }
}
