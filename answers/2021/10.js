import { QuestionBase } from '../../utils/question-base.js';

const matchers = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
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
  constructor(args) {
    super(2021, 10, 26397, 399153, 288957, 2995077699, args);
  }

  parseLine(line) {
    const characters = line.split('');
    const stack = [];

    for (const next of characters) {
      if (['(', '[', '{', '<'].includes(next)) {
        stack.unshift(next);
      } else {
        const previous = stack.shift();
        if (next !== matchers[previous]) return { corrupt: true, score: errorScores[next] };
      }
    }

    const score = stack.reduce((score, next) => score * 5 + completionScores[matchers[next]], 0);

    return { corrupt: false, score };
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
