import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 6, 3604, 46563);

    this.exampleInput({ part1: 17, part2: 16 }, 32);
  }

  get parser() {
    return Parsers.MULTI_LINE_DELIMITED_NUMBERS;
  }

  get split() {
    return ',';
  }

  getCoordinates(coordinates) {
    if (!this._coordinates) {
      const minX = coordinates.map(([x]) => x).reduce((a, b) => Math.min(a, b));
      const maxX = coordinates.map(([x]) => x).reduce((a, b) => Math.max(a, b));
      const minY = coordinates.map(([, y]) => y).reduce((a, b) => Math.min(a, b));
      const maxY = coordinates.map(([, y]) => y).reduce((a, b) => Math.max(a, b));

      const xys = Array.from({ length: maxX - minX }, (_, x) => minX + x).flatMap((x) =>
        Array.from({ length: maxY - minY }, (_, y) => ({ x, y: minY + y }))
      );

      this._coordinates = { minX, maxX, minY, maxY, xys };
    }
    return this._coordinates;
  }

  getTotalManhattan(x, y, coordinates) {
    return coordinates.reduce((total, [x2, y2]) => total + Math.abs(x - x2) + Math.abs(y - y2), 0);
  }

  part1(coordinates) {
    const { minX, maxX, minY, maxY, xys } = this.getCoordinates(coordinates);

    const out = xys.map(
      ({ x, y }) =>
        coordinates.reduce(
          ({ d, i }, [cx, cy], ix) => {
            const distance = Math.abs(x - cx) + Math.abs(y - cy);
            if (distance < d) return { d: distance, i: ix, dupe: false };
            if (distance === d) return { d };
            return { d, i };
          },
          { d: Infinity }
        ).i
    );

    const outs = countByValue(out);
    const infinites = coordinates
      .map(([x, y], ix) => (x === minX || x === maxX || y === minY || y === maxY ? `${ix}` : false))
      .filter(Boolean);
    return Object.entries(outs).reduce((a, [k, v]) => (infinites.includes(k) ? a : Math.max(a, v)), 0);
  }

  part2(coordinates, totalManhattan = 10000) {
    const { xys } = this.getCoordinates(coordinates);
    return xys.filter(({ x, y }) => this.getTotalManhattan(x, y, coordinates) < totalManhattan).length;
  }
}
