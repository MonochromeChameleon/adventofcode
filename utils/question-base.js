import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
export * as Parsers from '../parsers/parsers.js';
import * as Parsers from '../parsers/parsers.js';

export class QuestionBase {
  constructor(year, day, part1, part2) {
    this.year = year;
    this.day = day;
    this.answers = {
      part1,
      part2,
    };

    this.examples = [];
  }

  get input() {
    if (!this._input) {
      this._input = this.readFile(this.day);
    }
    return this._input;
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

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  get split() {
    return '';
  }

  parseValue(value) {
    return this.parser.parseValue.call(this, value);
  }

  parseLine(line) {
    return this.parser.parseLine.call(this, line);
  }

  parseInput(lines) {
    return this.parser.parseInput.call(this, lines);
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
