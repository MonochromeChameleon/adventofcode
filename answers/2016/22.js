import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 22, 985, 179);

    this.exampleInput({ filename: '22a', part2: 7 });
  }

  get parser() {
    return Parsers.MULTI_LINE_MAP;
  }

  map(line) {
    if (!line.startsWith('/dev/grid')) return undefined;
    const [, ...values] = /\/dev\/grid\/node-x(\d+)-y(\d+) +(\d+)T +(\d+)T +(\d+)T +(\d+)%/.exec(line);
    const [x, y, size, used, avail, use] = values.map(Number);
    return { x, y, size, used, avail, use };
  }

  findDetour(empty, blockage) {
    const minBlockX = blockage.map(({ x }) => x).reduce((a, b) => Math.min(a, b), Infinity);
    const maxBlockX = blockage.map(({ x }) => x).reduce((a, b) => Math.max(a, b), 0);

    if (empty.x > maxBlockX) return 0;
    if (empty.x < minBlockX) return 0;

    return (empty.x + 1 - minBlockX) * 2;
  }

  part1(nodes) {
    return nodes
      .filter(({ used }) => used)
      .reduce(
        (tot, { x, y, used }) =>
          tot + nodes.filter(({ xf, yf, avail }) => (xf !== x || yf !== y) && avail >= used).length,
        0
      );
  }

  part2(nodes) {
    const empty = nodes.find(({ used }) => !used);
    const blockage = nodes.filter(({ used }) => used > 100);
    const xMax = nodes.reduce((max, { x }) => Math.max(max, x), 0);

    const detour = this.findDetour(empty, blockage); // kludge
    return ((xMax - 1) * 5) + detour + xMax + empty.y - empty.x;
  }
}
