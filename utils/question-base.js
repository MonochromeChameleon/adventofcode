import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

export class QuestionBase {
  constructor(year, day, part1, part2) {
    this.year = year;
    this.day = day;
    this.answers = {
      part1,
      part2,
    };

    const lines = this.rawData.split('\n').filter((it) => it);
    this.input = this.parseInput(lines);
  }

  testInput(filePath, part1, part2) {
    // no-op yet
  }

  get rawData() {
    const inputFile = resolve(`./inputs/${this.year}/${this.day}.txt`);
    return existsSync(inputFile) ? readFileSync(inputFile, 'utf8') : '';
  }

  expectedResult(part) {
    const { [`part${part}`]: expected } = this.answers;
    return expected;
  }

  parseLine(line) {
    return Number(line);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  async part1() {
    return this.input.length;
  }

  async part2() {
    return this.input.length;
  }

  async run(part) {
    const result = await (part === 1 ? this.part1(this.input) : this.part2(this.input));
    return result;
  }
}
