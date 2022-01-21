import { Parser } from './parser.js';

export class MultiLineSplitParser extends Parser {
  parseInput(lines) {
    return lines.map((line) => line.split(this.split));
  }
}
