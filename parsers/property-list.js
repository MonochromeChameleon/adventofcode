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
    const [k, v] = line.split(this.split).map((it) => it.trim());
    const key = this.parseKey(k);
    const value = this.parseValue(v, key);
    return [key, value];
  }

  parseInput(lines) {
    return Object.fromEntries(lines.map(this.parseLine.bind(this)));
  }
}
