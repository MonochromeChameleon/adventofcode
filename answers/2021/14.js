import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2021, 14, 2712, 8336623059567);

    this.exampleInput({ filename: 'testinputs/14', part1: 1588, part2: 2188189693529 });
  }

  polymerize(polymer, insertionRules) {
    return Object.keys(polymer).reduce((out, key) => {
      const add = insertionRules[key];
      const [first, second] = key.split('');
      [first + add, add + second].forEach((newKey) => {
        out[newKey] = out[newKey] || 0;
        out[newKey] += polymer[key];
      });

      return out;
    }, {});
  }

  runPolymerizationSteps(polymer, insertionRules, steps) {
    return Array.from({ length: steps }).reduce((poly) => this.polymerize(poly, insertionRules), polymer);
  }

  countElements(polymer) {
    return Object.keys(polymer).reduce(
      (acc, key) => {
        const [, second] = key.split('');
        acc[second] = acc[second] || 0;
        acc[second] += polymer[key];
        return acc;
      },
      { N: 1 }
    );
  }

  parseLine(line) {
    return line.split(' -> ');
  }

  parseInput([template, ...lines]) {
    const insertionRules = lines.map(this.parseLine).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

    const pairs = Array.from({ length: template.length - 1 }).reduce((acc, _, index) => {
      const pair = template.slice(index, index + 2);
      acc[pair] = acc[pair] || 0;
      acc[pair] += 1;
      return acc;
    }, {});

    return {
      pairs,
      insertionRules,
    };
  }

  part1({ pairs, insertionRules }) {
    const polymer = this.runPolymerizationSteps(pairs, insertionRules, 10);
    const countsByCharacter = this.countElements(polymer);
    const counts = Object.values(countsByCharacter).sort((a, b) => a - b);
    return counts[counts.length - 1] - counts[0];
  }

  part2({ pairs, insertionRules }) {
    const polymer = this.runPolymerizationSteps(pairs, insertionRules, 40);
    const countsByCharacter = this.countElements(polymer);
    const counts = Object.values(countsByCharacter).sort((a, b) => a - b);
    return counts[counts.length - 1] - counts[0];
  }
}
