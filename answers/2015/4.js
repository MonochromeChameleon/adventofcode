import { QuestionBase } from '../../utils/question-base.js';
import { createHash } from 'crypto';

export class Question extends QuestionBase {
  constructor (args) {
    super(2015, 4, undefined, 254575, undefined, 1038736, args);
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
    let i = this.answers.actual.part1;
    let hash = 'x';
    while (hash.substr(0, 6) !== '000000') {
      i++;
      hash = createHash('md5').update(input + i).digest('hex');
    }

    return i;
  }
}
