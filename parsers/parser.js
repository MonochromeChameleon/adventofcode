export class Parser {
  get split() {
    return '';
  }

  map(value) {
    return value;
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
