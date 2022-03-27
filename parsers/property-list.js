import { Parser } from './parser.js';

export class PropertyListParser extends Parser {
  get split() {
    return ':';
  }

  parseKey(key) {
    return (
      key[0].toLowerCase() +
      key
        .slice(1)
        .split(' ')
        .map((k, ix) => (ix ? k[0].toUpperCase() + k.slice(1) : k))
        .join('')
    );
  }

  parseValue(value) {
    return Number(value);
  }

  parseLine(line) {
    const [k, v] = line.split(this.m.split).map((it) => it.trim());
    const key = this.m.parseKey.call(this, k);
    const value = this.m.parseValue.call(this, v, key);
    return [key, value];
  }

  parseInput(lines) {
    return Object.fromEntries(lines.map(this.m.parseLine.bind(this)));
  }
}
