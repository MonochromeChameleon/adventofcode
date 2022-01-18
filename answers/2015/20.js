import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 20, 786240, 831600);
  }

  get parser() {
    return Parsers.SINGLE_NUMBER;
  }

  stuff(number) {
    return Array.from({ length: number }, (_, i) => i + 1).filter((i) => number % i === 0).reduce((acc, i) => acc + (i * 10), 0);
  }

  part1 (input) {
    const houses = new Array(input / 10).fill(0);
    for (let i = 1; i < input / 10; i += 1) {
      for (let j = i; j < input / 10; j += i) {
        houses[j] += i * 10;
      }
    }

    return houses.findIndex((i) => i >= input);
  }

  part2 (input) {
    const houses = new Array(Math.ceil(input / 11)).fill(0);
    for (let i = 1; i < input / 11; i += 1) {
      for (let j = i, x = 0; x < 50 && j < input / 11; j += i, x += 1) {
        houses[j] += i * 11;
      }
    }

    return houses.findIndex((i) => i >= input);
  }
}
