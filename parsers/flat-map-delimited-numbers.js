import { Parser } from './parser.js';

export class FlatMapDelimitedNumbersParser extends Parser {
  get split() {
    return ' ';
  }

  parseLine(line) {
    return line
      .split(this.m.split)
      .filter((it) => it)
      .map(Number);
  }

  parseInput(lines) {
    return lines.flatMap(this.m.parseLine.bind(this));
  }
}
