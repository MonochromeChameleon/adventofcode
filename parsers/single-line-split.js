import { Parser } from './parser.js';

export class SingleLineSplitParser extends Parser {
  parseInput(lines) {
    return lines[0].split(this.split);
  }
}
