import { Parser } from './parser.js';

export class SingleLineDelimitedNumbersParser extends Parser {
  parseInput(input) {
    return input[0].split(this.split).map(Number);
  }
}
