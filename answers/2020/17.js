import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 17, 382, 2552);

    this.exampleInput({ input: ['.#.', '..#', '###'], part1: 112, part2: 848 });
  }

  get parser() {
    return Parsers.VECTOR_GAME_OF_LIFE;
  }

  next(point, neighbours) {
    if (neighbours.length === 3) return true;
    if (neighbours.length === 4) return neighbours.find((n) => n.equals(point));
    return false;
  }

  get dimensions() {
    return 3;
  }

  part1(active) {
    return this.generations(6, active).length;
  }

  part2(active) {
    const fourDimensions = active.map((p) => new Vector(...p.points, 0));
    return this.generations(6, fourDimensions, 4).length;
  }
}
