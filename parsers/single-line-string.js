import { Parser } from './parser.js';

export class SingleLineStringParser extends Parser {
  parseInput(lines) {
    return lines[0];
  }
}
