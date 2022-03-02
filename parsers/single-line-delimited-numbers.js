import { Parser } from './parser.js';

export class SingleLineDelimitedNumbersParser extends Parser {
  parseLine(line) {
    return line.split(this.m.split).map(Number);
  }

  parseInput(input) {
    return input.flatMap(this.m.parseLine.bind(this));
  }
}
