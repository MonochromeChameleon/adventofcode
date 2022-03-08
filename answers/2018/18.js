import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 18, 653184, 169106);

    this.exampleInput({ part1: 1147 });
  }

  get parser() {
    return Parsers.GAME_OF_LIFE;
  }

  next(value, neighbours) {
    const counts = countByValue(neighbours);
    switch (value) {
      case '.':
        return counts['|'] >= 3 ? '|' : '.';
      case '|':
        return counts['#'] >= 3 ? '#' : '|';
      case '#':
        return counts['#'] >= 1 && counts['|'] >= 1 ? '#' : '.';
    }
  }

  execute(grid, generations) {
    const after = this.generations(grid, generations);
    const counts = countByValue(after);
    return counts['#'] * counts['|'];
  }

  part1({ grid }) {
    return this.execute(grid, 10);
  }

  part2({ grid }) {
    return this.execute(grid, 1000000000);
  }
}
