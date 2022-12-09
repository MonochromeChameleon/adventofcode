import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const R = new Vector(1, 0);
const L = new Vector(-1, 0);
const U = new Vector(0, -1);
const D = new Vector(0, 1);

const DIRECTIONS = { R, L, U, D };

export class Question extends QuestionBase {
  constructor() {
    super(2022, 9, 5874, 2467);

    this.exampleInput({ filename: '9a', part1: 13, part2: 1 });
    this.exampleInput({ filename: '9b', part2: 36 });
  }

  get parser() {
    return Parsers.FLAT_MAP;
  }

  parseLine(l) {
    const [dir, steps] = l.split(' ');
    return Array.from({ length: Number(steps) }, () => DIRECTIONS[dir]);
  }

  nextStepFor({ x, y }) {
    if (Math.abs(x) === 2 || Math.abs(y) === 2) return new Vector(Math.sign(x), Math.sign(y));
    return new Vector(0, 0);
  }

  step(step, head, next, ...knots) {
    const newHead = head.add(step);
    if (!next) return [newHead];
    const displacement = newHead.subtract(next);
    const nextStep = this.nextStepFor(displacement);
    if (!nextStep.manhattan) return [newHead, next, ...knots];
    return [newHead, ...this.step(nextStep, next, ...knots)];
  }

  move({ knots, visited }, step) {
    const newKnots = this.step(step, ...knots);
    return { knots: newKnots, visited: visited.add(newKnots[newKnots.length - 1].toString()) };
  }

  snake(input, length) {
    const state = { knots: Array.from({ length }, () => new Vector(0, 0)), visited: new Set() };
    return input.reduce(this.move.bind(this), state);
  }

  part1(input) {
    const { visited } = this.snake(input, 2);
    return visited.size;
  }

  part2(input) {
    const { visited } = this.snake(input, 10);
    return visited.size;
  }
}
