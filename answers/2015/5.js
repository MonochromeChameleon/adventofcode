import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 5, 236, 51);

    this.exampleInput({ input: 'ugknbfddgicrmopn', part1: 1 });
    this.exampleInput({ input: 'jchzalrnumimnmhp', part1: 0 });
    this.exampleInput({ input: 'haegwjzuvuyypxyu', part1: 0 });
    this.exampleInput({ input: 'dvszwmarrgswjxmb', part1: 0 });
    this.exampleInput({ input: 'qjhvhtzxzqqjkmpb', part2: 1 });
    this.exampleInput({ input: 'xxyxx', part2: 1 });
    this.exampleInput({ input: 'uurcxstgmygtbstg', part2: 0 });
    this.exampleInput({ input: 'ieodomkazucvgmuy', part2: 0 });
  }

  parseInput(lines) {
    return lines;
  }

  allMatch(...regexes) {
    return (str) => regexes.every(regex => regex.test(str));
  }

  part1 (input) {
    const hasThreeVowels = /([aeiou].*){3}/;
    const hasDoubleLetter = /(.)\1/;
    const hasNoBadStrings = /^((?!ab|cd|pq|xy).)*$/;
    return input.filter(this.allMatch(hasThreeVowels, hasDoubleLetter, hasNoBadStrings)).length;
  }

  part2 (input) {
    const hasRepeatedPair = /(..).*\1/;
    const hasRepeatedLetterWithOneBetween = /(.).\1/;
    return input.filter(this.allMatch(hasRepeatedPair, hasRepeatedLetterWithOneBetween)).length;
  }
}
