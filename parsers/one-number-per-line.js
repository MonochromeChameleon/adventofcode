import { Parser } from './parser.js';

export class OneNumberPerLineParser extends Parser {
  parseLine(line) {
    return Number(line);
  }
}
