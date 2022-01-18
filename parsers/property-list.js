import { Parser } from './parser.js';

export class PropertyListParser extends Parser {
  parseValue(value) {
    return Number(value);
  }

  parseLine(line) {
    const [key, value] = line.split(this.split).map(it => it.trim());
    return [key, this.parseValue(value)];
  }

  parseInput(lines) {
    return Object.fromEntries(lines.map(this.parseLine.bind(this)))
  }
}
