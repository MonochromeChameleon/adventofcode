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

    this.examples = [];
    this.input = this.readFile(this.day);
  }

  exampleInput({ filename, input, part1, part2 }) {
    const parsedInput = input ? this.parseInput([input].flat()) : this.readFile(filename);
    this.examples.push({ input: parsedInput, part1, part2 });
  }

  readFile(filename) {
    const inputFile = resolve(`./inputs/${this.year}/${filename}.txt`);
    const rawData = existsSync(inputFile) ? readFileSync(inputFile, 'utf8') : '';
    const lines = rawData.split('\n').filter((it) => it);
    return this.parseInput(lines);
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
