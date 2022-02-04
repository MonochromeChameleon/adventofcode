import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 3, 917, 1649);

    this.exampleInput({
      input: ['101 301 501', '102 302 502', '103 303 503', '201 401 601', '202 402 602', '203 403 603'],
      part1: 3,
      part2: 6,
    });
  }

  get parser() {
    return Parsers.FLAT_MAP_LINE_DELIMITED_NUMBERS;
  }

  isValidTriangle(sides) {
    const [long, ...others] = sides.sort((a, b) => b - a);
    return long < others.reduce((sum, side) => sum + side);
  }

  part1(input) {
    const triangle = (i) => [input[3 * i], input[3 * i + 1], input[3 * i + 2]];
    const triangles = Array.from({ length: input.length / 3 }, (_, i) => triangle(i));
    return triangles.filter(this.isValidTriangle).length;
  }

  part2(input) {
    const translated = Array.from({ length: input.length / 9 }, (_, ix) => {
      const [a, b, c, d, e, f, g, h, i] = Array.from({ length: 9 }, (__, iy) => input[9 * ix + iy]);
      return [a, d, g, b, e, h, c, f, i];
    }).flat();
    return this.part1(translated);
  }
}
