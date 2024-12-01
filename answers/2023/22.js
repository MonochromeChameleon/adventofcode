import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 22, 465, 79042);

    this.exampleInput({ part1: 5, part2: 7 });
  }

  parseLine(line, id) {
    const [x1, y1, z1, x2, y2, z2] = line.split(/[,~]/).map(Number);
    const x = [x1, x2].sort((a, b) => a - b);
    const y = [y1, y2].sort((a, b) => a - b);
    const z = [z1, z2].sort((a, b) => a - b);

    return { id, x, y, z };
  }

  postParse(input) {
    const xmax = input.map(({ x: [, x] }) => x).reduce((a, b) => Math.max(a, b));
    const ymax = input.map(({ y: [, y] }) => y).reduce((a, b) => Math.max(a, b));
    const settled = input
      .sort(({ z: [a] }, { z: [b] }) => a - b)
      .reduce(({ topSurface, bricks }, { z: [z1, z2], ...brick }) => {
        const { x: [x1, x2], y: [y1, y2] } = brick;
        const xys = Array.from(({ length: y2 + 1 - y1 }), (_, iy) => y1 + iy).flatMap((y) => Array.from({ length: x2 + 1 - x1 }, (_, ix) => ({
          x: x1 + ix,
          y
        })));
        const zmin = xys.map(({ x, y }) => topSurface[y][x]).reduce((a, b) => Math.max(a, b)) + 1;
        xys.forEach(({ x, y }) => topSurface[y][x] = zmin + z2 - z1);
        bricks.push({ ...brick, z: [zmin, zmin + z2 - z1] });
        return { topSurface, bricks };
      }, {
        topSurface: Array.from({ length: ymax + 1 }, () => Array.from({ length: xmax + 1 }, () => 0)),
        bricks: []
      });

    const isOverlap = ([a, b], [c, d]) => (a >= c && a <= d) || (b >= c && b <= d) || (c >= a && c <= b) || (d >= a && d <= b);

    return settled.bricks.map((brick) => {
      const { x: xb, y: yb, z: [zmin, zmax] } = brick;
      const supportedBy = settled.bricks
        .filter(({ z: [, z] }) => z === zmin - 1)
        .filter(({ x: xc, y: yc }) => isOverlap(xb, xc) && isOverlap(yb, yc))
        .map(({ id }) => id);

      const supporting = settled.bricks
        .filter(({ z: [z] }) => z === zmax + 1)
        .filter(({ x: xc, y: yc }) => isOverlap(xb, xc) && isOverlap(yb, yc))
        .map(({ id }) => id);

      return { ...brick, supporting, supportedBy };
    });
  }

  part1(bricks) {
    return bricks
      .filter((b) => bricks
        .filter((k) => b.supporting.includes(k.id))
        .every((k) => k.supportedBy.length > 1)
      ).length;
  }

  chainReaction(brick) {
    const destroyed = [];
    let chain = [brick.id];
    while (chain.length) {
      destroyed.push(...chain);
      chain = this._input.filter(({ id, supportedBy }) => !destroyed.includes(id) && supportedBy.length && supportedBy.every((sb) => destroyed.includes(sb)))
        .flatMap((cb) => this.withCache.chainReaction(cb));
    }

    return destroyed;
  }

  part2(bricks) {
    return bricks
      .filter((b) => bricks
        .filter((k) => b.supporting.includes(k.id))
        .some((k) => k.supportedBy.length === 1)
      )
      .sort(({ z: [, a] }, { z: [, b] }) => b - a)
      .map((b) => this.withCache.chainReaction(b).length - 1)
      .reduce((a, b) => a + b);
  }
}
