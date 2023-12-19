import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 18, 34329, 42617947302920);

    this.exampleInput({ part1: 62, part2: 952408144115 });
  }

  parseLine(line) {
    const [direction, count, color] = line.split(' ');

    const d2 = ['R', 'D', 'L', 'U'][Number(color[7])];
    const c2 = parseInt(color.substring(2, 7), 16);

    return { part1: { direction, count: Number(count) }, part2: { direction: d2, count: c2 } };
  }

  calculateArea(lines, p) {
    const { area: a2 } = lines.reduce(({ x, y, area }, { [p]: { direction: d, count: c } }) => {
      const newX = x + ((['L', 'U', 'R', 'D'].indexOf(d) - 1) % 2) * c;
      const newY = y + ((['U', 'R', 'D', 'L'].indexOf(d) - 1) % 2) * c;

      return { x: newX, y: newY, area: area + c + (newY * x) - (newX * y) };
    }, { x: 0, y: 0, area: 0 });

    return a2 / 2 + 1;
  }

  part1(input) {
    return this.calculateArea(input, 'part1');
  }

  part2(input) {
    return this.calculateArea(input, 'part2');
  }
}
