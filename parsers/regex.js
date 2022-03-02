import { Parser } from './parser.js';

export class RegexParser extends Parser {
  parseLine(line) {
    const [, ...matches] = this.m.regex.exec(line);
    return matches.map((match) => (Number.isNaN(Number(match)) ? match : Number(match)));
  }
}
