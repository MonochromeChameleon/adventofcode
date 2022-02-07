import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 4, 337, 231);
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  get split() {
    return ' ';
  }

  isAnagram(a, b) {
    return a.split('').sort().join('') === b.split('').sort().join('');
  }

  hasNoAnagrams(...words) {
    for (let i = 0; i < words.length; i += 1) {
      for (let j = i + 1; j < words.length; j += 1) {
        if (this.isAnagram(words[i], words[j])) {
          return false;
        }
      }
    }
    return true;
  }

  part1(input) {
    return input.filter(line => line.length === [...new Set(line)].length).length;
  }

  part2(input) {
    return input.filter((line) => this.hasNoAnagrams(...line)).length;
  }
}
