import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 3, 430, 312453);

    this.exampleInput({ input: 1, part1: 0 });
    this.exampleInput({ input: 12, part1: 3 });
    this.exampleInput({ input: 23, part1: 2 });
    this.exampleInput({ input: 1024, part1: 31 });
  }

  get parser() {
    return Parsers.SINGLE_NUMBER;
  }

  getDetails(input) {
    let ring = 0;
    let maxNum = 1;
    while (maxNum + 8 * ring < input) {
      maxNum += 8 * ring;
      ring += 1;
    }
    const sideLength = 2 * ring;
    const remainder = input - maxNum;
    const overlap = (input - maxNum) % sideLength || 0;
    const toMiddle = Math.abs(overlap - sideLength / 2) || 0;
    const manhattan = toMiddle + ring;
    return { ring, remainder, sideLength, overlap, toMiddle, manhattan };
  }

  getNeighbours(value) {
    const { ring, remainder, overlap, sideLength } = this.getDetails(value);
    const { ring: r } = this.getDetails(value - 1);
    if (ring > r) {
      return [value - 1, value - (8 * ring - 8)];
    }
    if (overlap === 0) {
      const vals = [value - 1, value - 2 * (4 * (ring - 1) + remainder / sideLength)];
      if (remainder / sideLength === 4) return [...vals, vals[1] + 1];
      return vals;
    }
    if (overlap === 1) {
      const inner = value - 2 * (4 * (ring - 1) + ~~(remainder / sideLength));
      if (ring > 1) return [value - 1, value - 2, inner, inner - 1];
      if (value === 8) return [7, 6, 2, 1];
      return [value - 1, value - 2, inner - 1];
    }
    if (overlap === sideLength - 1) {
      const inner = value - 1 - 2 * (4 * (ring - 1) + ~~(remainder / sideLength));
      if (remainder === 4 * sideLength - 1) return [value - 1, inner + 1, inner, inner - 1];
      return [value - 1, inner, inner - 1];
    }
    if (remainder === 2) {
      const inner = value - 2 * (4 * (ring - 1) + ~~(remainder / sideLength));
      return [value - 1, value - 2, inner, inner - 1];
    }
    const inner = value - 2 * (4 * (ring - 1) + ~~(remainder / sideLength));
    return [value - 1, inner, inner - 1, inner - 2];
  }

  getNextTotal(totals) {
    const nextIx = totals.length + 1;
    const neighbours = this.getNeighbours(nextIx);
    return neighbours
      .map((n) => totals[n - 1])
      .filter((it) => it)
      .reduce((a, b) => a + b);
  }

  part1(input) {
    const { manhattan } = this.getDetails(input);
    return manhattan;
  }

  part2(input) {
    // not 61
    const totals = [1];
    while (totals[totals.length - 1] < input) {
      totals.push(this.getNextTotal(totals));
    }
    return totals[totals.length - 1];
  }
}
