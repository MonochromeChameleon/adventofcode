import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 24, 10723906903, 74850409);
  }

  get parser() {
    return Parsers.ONE_NUMBER_PER_LINE;
  }

  findCombinations(targetWeight, ...availableWeights) {
    if (availableWeights.reduce((a, b) => a + b, 0) < targetWeight) return [];

    const out = [];
    for (let i = 0; i < availableWeights.length; i += 1) {
      const w = availableWeights[i];
      if (w === targetWeight) {
        out.push([w]);
      } else if (w < targetWeight) {
        const combinations = this.findCombinations(targetWeight - w, ...availableWeights.slice(i + 1));
        combinations.forEach((c) => out.push([w, ...c]));
      }
    }
    return out;
  }

  part1(input) {
    const totalWeight = input.reduce((a, b) => a + b);
    const targetWeight = totalWeight / 3;
    const combinations = this.findCombinations(targetWeight, ...input);
    const smallestCombinations = combinations.slice(1).reduce(
      (sofar, combo) => {
        if (combo.length < sofar[0].length) return [combo];
        if (combo.length === sofar[0].length) return [...sofar, combo];
        return sofar;
      },
      [combinations[0]]
    );
    return smallestCombinations.map((combo) => combo.reduce((a, b) => a * b)).reduce((a, b) => Math.min(a, b));
  }

  part2(input) {
    const totalWeight = input.reduce((a, b) => a + b);
    const targetWeight = totalWeight / 4;
    const combinations = this.findCombinations(targetWeight, ...input);
    const smallestCombinations = combinations.slice(1).reduce(
      (sofar, combo) => {
        if (combo.length < sofar[0].length) return [combo];
        if (combo.length === sofar[0].length) return [...sofar, combo];
        return sofar;
      },
      [combinations[0]]
    );
    return smallestCombinations.map((combo) => combo.reduce((a, b) => a * b)).reduce((a, b) => Math.min(a, b));
  }
}
