import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';

export class Question extends QuestionBase {
  constructor() {
    super(2019, 20, 668, 7778);
    this.wip = true;

    this.exampleInput({ part1: 23, part2: 26 });
    this.exampleInput({ part1: 58 });
    this.exampleInput({ part2: 396 });
  }

  get parser() {
    return Parsers.MAZE;
  }

  postParse(maze) {
    maze.squares.forEach((sq, ix) => {
      if (sq === '#' || sq === '.' || sq === ' ') return;

      const neighbours = maze.neighbours(ix);
      if (neighbours.every((n) => maze.squares[n] !== '.')) return;

      const sq2 = neighbours.find((it) => /[A-Z]/.test(maze.squares[it]));
      maze.squares[ix] = [sq, maze.squares[sq2]].sort().join('');
      maze.squares[sq2] = ' ';
    });

    return maze;
  }

  isOutwardPortal(maze, ix) {
    const y = ~~(ix / maze.width);
    const x = ix % maze.width;

    return y < 2 || y > maze.height - 3 || x < 2 || x > maze.width - 3;
  }

  matchingPortal(maze, ix, depth) {
    const portal = maze.squares[ix];
    const match = maze.squares.findIndex((sq, p) => sq === portal && p !== ix);
    if (match === -1) return false;
    const portalIx = maze.neighbours(match).find((n) => maze.squares[n] === '.');
    const isOutward = this.isOutwardPortal(maze, ix);
    if (isOutward && depth === 0) return false;
    return `${portalIx}:${isOutward ? depth - 1 : depth + 1}`;
  }

  neighbours(maze, state) {
    const [ix, depth] = state.split(':').map(Number);
    return maze
      .neighbours(ix)
      .map((n) => (maze.squares[n] === '.' ? `${n}:${depth}` : this.matchingPortal(maze, n, depth)))
      .filter(Boolean);
  }

  doMaze(input, goal) {
    const start = input.neighbours(input.squares.findIndex((sq) => sq === 'AA')).find((n) => input.squares[n] === '.');

    return dijkstra({
      start: `${start}:0`,
      goal,
      neighbours: (ix) => this.neighbours(input, ix),
      output: 'distance',
    });
  }

  part1(input) {
    const goal = input.neighbours(input.squares.findIndex((sq) => sq === 'ZZ')).find((n) => input.squares[n] === '.');
    return this.doMaze(input, (state) => state.split(':').map(Number)[0] === goal);
  }

  part2(input) {
    const goal = input.neighbours(input.squares.findIndex((sq) => sq === 'ZZ')).find((n) => input.squares[n] === '.');
    return this.doMaze(input, `${goal}:0`);
  }
}
