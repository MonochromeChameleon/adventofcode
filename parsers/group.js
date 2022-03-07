import { Parser } from './parser.js';

export class GroupParser extends Parser {
  parseInput(lines) {
    return Array.from({ length: lines.length / this.m.groupSize }, (_, i) =>
      this.parseGroup(lines.slice(i * this.m.groupSize, (i + 1) * this.m.groupSize))
    );
  }
}
