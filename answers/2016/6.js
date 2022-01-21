import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 6, 'gyvwpxaz', 'jucfoary');

    this.exampleInput({ filename: '6a', part1: 'easter', part2: 'advent' });
  }

  get parser() {
    return Parsers.ONE_STRING_PER_LINE;
  }

  part1(input) {
    return Array.from({ length: input[0].length }).map((_, i) => {
      const chars = countByValue(input.map(line => line[i]));
      const best = Math.max(...Object.values(chars));
      return Object.entries(chars).find(([, count]) => count === best)[0];
    }).join('');
  }

  part2(input) {
    return Array.from({ length: input[0].length }).map((_, i) => {
      const chars = countByValue(input.map(line => line[i]));
      const worst = Math.min(...Object.values(chars));
      return Object.entries(chars).find(([, count]) => count === worst)[0];
    }).join('');
  }
}
