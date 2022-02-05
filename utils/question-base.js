import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import * as Parsers from '../parsers/parsers.js';

export * as Parsers from '../parsers/parsers.js';

function getAllMethodNames(obj) {
  if (obj === null) return [];
  return new Set([...Reflect.ownKeys(obj), ...getAllMethodNames(Reflect.getPrototypeOf(obj))]);
}

export class QuestionBase {
  constructor(year, day, part1, part2) {
    this.year = year;
    this.day = day;
    this.answers = {
      part1,
      part2,
    };

    this.examples = [];

    const parserProps = getAllMethodNames(this.parser);
    const ownProps = getAllMethodNames(this);

    [...parserProps]
      .filter((prop) => !ownProps.has(prop))
      .forEach((prop) => {
        const p = this.parser[prop];
        this[prop] = typeof p === 'function' ? p.bind(this) : p;
      });
  }

  get input() {
    if (!this._input) {
      this._input = this.readFile(this.day);
    }
    return this._input;
  }

  exampleInput({ filename, input, part1, part2 }, ...params) {
    const parsedInput = input ? this.parseInput([input].flat()) : this.readFile(filename);
    this.examples.push({ input: parsedInput, part1, part2, params });
  }

  readFile(filename) {
    const inputFile = resolve(`./inputs/${this.year}/${filename}.txt`);
    const rawData = existsSync(inputFile) ? readFileSync(inputFile, 'utf8') : '';
    const lines = rawData.split('\n').filter((it) => it);
    return this.parseInput(lines);
  }

  expectedResult(part) {
    if (part === 2 && this.day === 25) return null;
    const { [`part${part}`]: expected } = this.answers;
    return expected;
  }

  get parser() {
    return Parsers.PARSER;
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
