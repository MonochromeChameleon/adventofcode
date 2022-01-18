export class Parser {
  get split() {
    return '';
  }

  parseKey(key) {
    return key;
  }

  parseValue(value) {
    return value;
  }

  parseLine(line) {
    return line;
  }

  parseInput(lines) {
    return lines.map(this.parseLine.bind(this));
  }
}
