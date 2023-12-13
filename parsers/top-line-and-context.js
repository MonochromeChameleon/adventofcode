import { Parser } from './parser.js';

export class TopLineAndContextParser extends Parser {
  parseInput([line, ...lines]) {
    const first = this.m.parseTop(line);
    const context = lines.map((l) => this.m.parseLine(l));

    return { first, context };
  }
}
