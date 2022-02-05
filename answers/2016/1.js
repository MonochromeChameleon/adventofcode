import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 1, 299, 181);

    this.exampleInput({ input: 'R2, L3', part1: 5 });
    this.exampleInput({ input: 'R2, R2, R2', part1: 2 });
    this.exampleInput({ input: 'R5, L5, R5, R3', part1: 12 });
    this.exampleInput({ input: 'R8, R4, R4, R8', part2: 4 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_SPLIT_MAP;
  }

  get split() {
    return ',';
  }

  parseValue(value) {
    const [turn, ...distance] = value;
    return {
      turn,
      distance: Number(distance.join('')),
    };
  }

  step({ dir: [dx, dy], pos: [x, y] }, { turn, distance }) {
    const dx1 = turn === 'L' ? -dy : dy;
    const dy1 = turn === 'L' ? dx : -dx;

    const x1 = x + dx1 * distance;
    const y1 = y + dy1 * distance;
    return { dir: [dx1, dy1], pos: [x1, y1] };
  }

  route({ dir: [dx, dy], visited }, { turn, distance }) {
    const [x, y] = visited[visited.length - 1];
    const dx1 = turn === 'L' ? -dy : dy;
    const dy1 = turn === 'L' ? dx : -dx;

    const steps = Array.from({ length: distance }, (_, i) => [x + dx1 * (i + 1), y + dy1 * (i + 1)]);

    return { dir: [dx1, dy1], visited: [...visited, ...steps] };
  }

  part1(input) {
    const start = { dir: [0, 1], pos: [0, 0] };
    return input
      .reduce(this.step, start)
      .pos.map(Math.abs)
      .reduce((a, b) => a + b);
  }

  part2(input) {
    const start = { dir: [0, 1], visited: [[0, 0]] };
    const visited = input.reduce(this.route, start).visited.map((v) => v.join(':'));

    const visitTwice = visited.find((p, ix) => visited.indexOf(p) !== ix);
    return visitTwice
      .split(':')
      .map(Math.abs)
      .reduce((a, b) => a + b);
  }
}
