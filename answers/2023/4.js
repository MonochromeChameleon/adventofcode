import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 4, 20667, 5833065);

    this.exampleInput({ part1: 13, part2: 30 });
  }

  parseLine(line) {
    const [, w, n] = line.split(/\s*[:|]\s*/);
    const winning = w.split(/\s+/).map(Number);
    const numbers = n.split(/\s+/).map(Number);
    return { winning, numbers };
  }

  countMatches({ winning, numbers }) {
    return numbers.filter((n) => winning.includes(n)).length;
  }

  part1(input) {
    return input.map((inp) => this.countMatches(inp)).filter(Boolean).map((m) => 2 ** (m - 1)).reduce((a, b) => a + b);
  }

  part2([first, ...rest]) {
    return rest.reduce(({ running, next: [next = 1, ...soon] }, card) => {
      const matches = this.countMatches(card);
      const newNext = Array.from({ length: Math.max(soon.length, matches) }, (_, ix) => (soon[ix] || 1) + (ix < matches ? next : 0));
      return { running: running + next, next: newNext.length ? newNext : [1] }
    }, { running: 1, next: Array.from({ length: this.countMatches(first) }, () => 2) }).running;
  }
}
