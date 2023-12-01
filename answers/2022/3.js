import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 3, 7889, 2825);

    this.exampleInput({
      input: [
        'vJrwpWtwJgWrhcsFMMfFFhFp',
        'jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL',
        'PmmdzqPrVvPwwTWBwg',
        'wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn',
        'ttgJtRGJQctTZtZT',
        'CrZsJsPPZsGzwwsLwLmpwMDw',
      ],
      part1: 157,
      part2: 70,
    });
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  score(item) {
    const uppercase = /[A-Z]/.test(item);
    return 1 + item.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0) + (uppercase ? 26 : 0);
  }

  part1(input) {
    const bags = input.map((bag) => {
      const [a, b] = [bag.slice(0, bag.length / 2), bag.slice(bag.length / 2)];
      const inBoth = a.find((c) => b.includes(c));
      return { item: inBoth, score: this.score(inBoth) };
    });

    return bags.map(({ score }) => score).reduce((a, b) => a + b, 0);
  }

  part2(input) {
    const groups = Array.from({ length: input.length / 3 }, (_, ix) => input.slice(ix * 3, (ix + 1) * 3));
    const badges = groups.map(([a, b, c]) => {
      const ab = a.filter((aa) => b.includes(aa));
      return ab.find((bb) => c.includes(bb));
    });

    return badges.map((b) => this.score(b)).reduce((a, b) => a + b, 0);
  }
}
