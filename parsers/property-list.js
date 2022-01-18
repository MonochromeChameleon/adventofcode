import { Parser } from './parser.js';

export class PropertyListParser extends Parser {
  get split() {
    return ':';
  }

  parseKey(key) {
    return key[0].toLowerCase() + key.slice(1).replace(/\s+/g, '');
  }

  parseValue(value) {
    return Number(value);
  }

  parseLine(line) {
    const [key, value] = line.split(this.split).map(it => it.trim());
    return [this.parseKey(key), this.parseValue(value)];
  }

  parseInput(lines) {
    return Object.fromEntries(lines.map(this.parseLine.bind(this)))
  }
}
