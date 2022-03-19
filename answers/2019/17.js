import { IntcodeQuestion } from './intcode/intcode-question.js';
import { Vector } from '../../utils/vector.js';

class Square extends Vector {
  constructor(x, y, type) {
    super(x, y);
    this.type = type;
  }

  isIntersection(squares) {
    return (
      squares.filter(
        (it) =>
          it !== this &&
          it.type === this.type &&
          Math.abs(it.x - this.x) <= 1 &&
          Math.abs(it.y - this.y) <= 1 &&
          (it.x === this.x || it.y === this.y)
      ).length === 4
    );
  }
}

class Scaffold {
  constructor(ascii) {
    const rows = ascii.split(/\n/);
    this.squares = [];
    rows.forEach((row, yix) => {
      const cells = row.split('');
      cells.forEach((c, xix) => this.square(xix, yix, c));
    });
  }

  square(x, y, type) {
    this.squares.push(new Square(x, y, type));
  }

  get intersections() {
    const scaff = this.squares.filter((it) => it.type === '#');
    return scaff.filter((it) => it.isIntersection(scaff));
  }
}

export class Question extends IntcodeQuestion {
  constructor() {
    super(2019, 17, 4372, 945911);
  }

  part1(input) {
    const output = [];
    while (!input.terminated) {
      input.toOutput();
      output.push(input.output);
    }

    const ascii = output.map((it) => String.fromCharCode(it)).join('');

    const scaffold = new Scaffold(ascii);
    const intersections = scaffold.intersections;

    return intersections.map((it) => it.x * it.y).reduce((s, m) => s + m, 0);
  }

  part2(input) {
    const a = ['L', 8, 'R', 12, 'R', 12, 'R', 10];
    const b = ['R', 10, 'R', 12, 'R', 10];
    const c = ['L', 10, 'R', 10, 'L', 6];

    const p = ['A', 'B', 'A', 'B', 'C', 'C', 'B', 'A', 'B', 'C'];

    input.override(0, 2);

    const inputFunction = (...commands) =>
      [...commands.join(',').split(''), '\n'].map((it) => it.charCodeAt(0)).forEach(input.input.bind(input));

    inputFunction(...p);
    inputFunction(...a);
    inputFunction(...b);
    inputFunction(...c);
    inputFunction('n');

    input.run();

    return input.output;
  }
}
