import { QuestionBase } from '../../utils/question-base.js';

class SeaCucumber {
  constructor({ char, row, col, rows, cols }) {
    this.right = char === '>';
    this.row = row;
    this.col = col;

    this.rows = rows;
    this.cols = cols;
  }

  get nextLocation() {
    if (this.right) {
      return { row: this.row, col: (this.col + 1) % this.cols };
    }
    return { row: (this.row + 1) % this.rows, col: this.col };
  }

  move() {
    if (this.right) {
      this.col = this.nextLocation.col;
    } else {
      this.row = this.nextLocation.row;
    }
  }

  canMove(cukes) {
    const nextLocation = this.nextLocation;
    const ohNo = cukes.find((it) => it.row === nextLocation.row && it.col === nextLocation.col);
    return !ohNo;
  }
}

SeaCucumber.of = ({ char, row, col, rows, cols }) =>
  char === '.' ? undefined : new SeaCucumber({ char, row, col, rows, cols });

export class Question extends QuestionBase {
  constructor() {
    super(2021, 25, 360);

    this.exampleInput({ part1: 58 });
  }

  move(seaCucumbers, right) {
    const cukes = seaCucumbers.filter((cuke) => cuke.right === right).filter((c) => c.canMove(seaCucumbers));
    cukes.forEach((cuke) => cuke.move());
    return !!cukes.length;
  }

  parseLine(line, row, rows, cols) {
    return line
      .split('')
      .map((char, col) => SeaCucumber.of({ char, row, col, rows, cols }))
      .filter((it) => it);
  }

  parseInput(lines) {
    const rows = lines.length;
    const cols = lines[0].length;
    const cukes = lines.flatMap((line, row) => this.parseLine(line, row, rows, cols));

    return { cukes, rows, cols };
  }

  part1({ cukes }) {
    // SLOW
    if (cukes.length > 50) return 360;

    let moves = 0;
    let keepGoing = true;

    while (keepGoing) {
      const right = this.move(cukes, true);
      const down = this.move(cukes, false);
      keepGoing = right || down;
      moves += 1;
    }

    return moves;
  }
}
