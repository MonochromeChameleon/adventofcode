import { QuestionBase } from '../../utils/question-base.js';
import { createHash } from 'crypto';

export class Question extends QuestionBase {
  constructor() {
    super(2015, 4, 254575, 1038736);

    this.exampleInput({ input: 'abcdef', part1: 609043 });
    this.exampleInput({ input: 'pqrstuv', part1: 1048970 });
  }

  parseInput(lines) {
    return lines.join('');
  }

  part1 (input) {
    let i = 0;
    let hash = 'x';
    while (hash.substr(0, 5) !== '00000') {
      i++;
      hash = createHash('md5').update(input + i).digest('hex');
    }

    return i;
  }

  part2 (input) {
    let i = this.answers.part1;
    let hash = 'x';
    while (hash.substr(0, 6) !== '000000') {
      i++;
      hash = createHash('md5').update(input + i).digest('hex');
    }

    return i;
  }
}
