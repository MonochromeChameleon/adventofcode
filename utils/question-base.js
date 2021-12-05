import { resolve } from 'path';
import { readFileSync } from 'fs';

export class QuestionBase {
  constructor(day, at1, at2, aa1, aa2, { useTestData }) {
    this.day = day;
    this.answers = {
      test: {
        part1: at1,
        part2: at2,
      },
      actual: {
        part1: aa1,
        part2: aa2,
      },
    };

    this.useTestData = useTestData;

    const lines = this.rawData.split('\n').filter((it) => it);
    this.input = this.parseInput(lines);
  }

  get rawData() {
    const root = this.useTestData ? './test' : '.';
    const inputFile = resolve(`${root}/inputs/${this.day}.txt`);

    return readFileSync(inputFile, 'utf8');
  }

  expectedResult(part) {
    const { [`part${part}`]: expected } = this.useTestData ? this.answers.test : this.answers.actual;
    return expected;
  }

  parseLine(line) {
    return Number(line);
  }

  parseInput(lines) {
    return lines.map(this.parseLine);
  }

  async part1() {
    return this.file.length;
  }

  async part2() {
    return this.file.length;
  }

  async run(part) {
    const result = await (part === 1 ? this.part1(this.input) : this.part2(this.input));
    return result;
  }
}
