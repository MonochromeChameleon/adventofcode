import { Parser } from './parser.js';

export class SingleLineParser extends Parser {
  parseInput(lines) {
    return this.m.parseLine.call(this, lines[0]);  
  }
}
