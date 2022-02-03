import { Parser } from './parser.js';

export class SingleStringParser extends Parser {
  parseInput(lines) {
    return lines[0];
  }
}
