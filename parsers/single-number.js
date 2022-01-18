import { Parser } from './parser.js';

export class SingleNumberParser extends Parser {
  parseInput(lines) {
    return Number(lines[0]);
  }
}
