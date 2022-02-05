import { Parser } from './parser.js';

export class SingleLineDelimitedNumbersParser extends Parser {
  parseLine(line) {
    return line.split(this.split).map(Number);
  }

  parseInput(input) {
    return input.flatMap(this.parseLine.bind(this));
  }
}
