import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { alphabet } from '../../utils/alphabet.js';

const LETTERS = alphabet(26);

export class Question extends QuestionBase {
  constructor() {
    super(2018, 5, 9078, 5698);

    this.exampleInput({ input: 'dabAcCaCBAcCcaDA', part1: 10, part2: 4 });
  }

  get parser() {
    return Parsers.SINGLE_STRING;
  }

  react(input) {
    let previousLength = input.length + 1;
    let polymer = input;

    const pairs = LETTERS.flatMap((l) => [l + l.toUpperCase(), l.toUpperCase() + l]);
    const rx = new RegExp(`(${pairs.join('|')})`, 'g');

    while (polymer.length < previousLength) {
      previousLength = polymer.length;
      polymer = polymer.replaceAll(rx, '');
    }
    return polymer.length;
  }

  part1(input) {
    return this.react(input);
  }

  part2(input) {
    return LETTERS.map((c) => input.replaceAll(new RegExp(c, 'gi'), ''))
      .map(this.react)
      .reduce((a, b) => Math.min(a, b));
  }
}
