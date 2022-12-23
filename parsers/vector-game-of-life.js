import { Parser } from './parser.js';
import { Vector } from '../utils/vector.js';

export class VectorGameOfLifeParser extends Parser {
  get dimensions() {
    return 2;
  }

  next() {
    return true;
  }

  getNeighbours(p, points) {
    return points.filter((n) => n.points.every((np, ix) => Math.abs(np - p.points[ix]) <= 1));
  }

  generateConwaySpace(points, dimensions = this.dimensions) {
    const [xs, ...others] = Array.from({ length: dimensions }, (_, i) => i).reduce((ranges, axis) => {
      const min = Math.min(...points.map((p) => p.points[axis]));
      const max = Math.max(...points.map((p) => p.points[axis]));
      return [...ranges, { min, max }];
    }, []);

    return others
      .reduce(
        (axs, { min, max }) => {
          const yys = Array.from({ length: max + 3 - min }, (_, o) => min + o - 1);
          return axs.flatMap((ax) => yys.map((yy) => [...ax, yy]));
        },
        Array.from({ length: xs.max + 3 - xs.min }).map((_, ix) => [xs.min + ix - 1])
      )
      .map((values) => new Vector(...values));
  }

  generation({
    points,
    dimensions = this.dimensions,
    getNeighbours = this.getNeighbours.bind(this),
    nextFn = this.next.bind(this)
  }) {
    const conwaySpace = this.generateConwaySpace(points, dimensions);
    return conwaySpace.filter((v) => nextFn(v, getNeighbours(v, points)));
  }

  generations(
    count,
    start,
    dimensions = this.dimensions,
    getNeighbours = this.getNeighbours.bind(this),
    nextFn = this.next.bind(this)
  ) {
    return Array.from({ length: count }).reduce(
      (points, _, ix) => this.generation({ points, dimensions, getNeighbours, nextFn, generation: ix }),
      start
    );
  }

  parseInput(lines) {
    return lines
      .flatMap((line, y) => line.split('').map((value, x) => (value === '#' ? [x, y] : null)))
      .filter((p) => p !== null)
      .map(([x, y]) => {
        const points = new Array(this.dimensions).fill(0);
        points[0] = x;
        points[1] = y;
        return new Vector(...points);
      });
  }
}
