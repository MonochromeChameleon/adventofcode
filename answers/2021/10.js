import { QuestionBase } from '../../utils/question-base.js';

const matchers = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
};

const errorScores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const completionScores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

export class Question extends QuestionBase {
  constructor() {
    super(2021, 10, 399153, 2995077699);

    this.exampleInput({ part1: 26397, part2: 288957 });
  }

  parseLine(line) {
    const characters = line.split('');

    const { stack: s, corrupt: c } = characters.reduce(
      ({ stack, corrupt }, next) => {
        if (corrupt) return { stack, corrupt };
        if (['(', '[', '{', '<'].includes(next)) return { stack: [next, ...stack] };
        const [previous, ...rest] = stack;
        if (next !== matchers[previous]) return { stack: [matchers[next]], corrupt: true };
        return { stack: rest };
      },
      { stack: [] },
    );

    const scores = c ? errorScores : completionScores;
    return { corrupt: c, score: s.reduce((tot, next) => tot * 5 + scores[matchers[next]], 0) };
  }

  part1(input) {
    return input.filter((it) => it.corrupt).reduce((sum, line) => sum + line.score, 0);
  }

  part2(input) {
    const scores = input
      .filter((it) => !it.corrupt)
      .map((it) => it.score)
      .sort((a, b) => a - b);
    const midIndex = Math.floor(scores.length / 2);
    return scores[midIndex];
  }
}
