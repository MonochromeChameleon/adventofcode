import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { aStarSearch } from '../../utils/a-star.js';
import { buildAdjacencyMap } from '../../utils/grid-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 22, 11462, 1054);

    this.exampleInput({ input: ['depth: 510', 'target: 10, 10'], part1: 114, part2: 45 });
  }

  get parser() {
    return Parsers.PROPERTY_LIST;
  }

  parseValue(input) {
    const [x, y] = input.split(',').map(Number);
    if (!y) return x;
    return { x, y };
  }

  generateMap({ depth, target: { x, y }, width, height }) {
    const geologicIndices = Array.from({ length: width * height }).reduce((sofar, _, i) => {
      const xx = i % width;
      const yy = ~~(i / width);
      if (i === 0 || (xx === x && yy === y)) return [...sofar, 0];
      if (!yy) return [...sofar, (xx * 16807) % 20183];
      if (!xx) return [...sofar, (yy * 48271) % 20183];
      return [...sofar, (((sofar[i - 1] + depth) % 20183) * ((sofar[i - width] + depth) % 20183)) % 20183];
    }, []);
    const erosionLevels = geologicIndices.map((i) => (i + depth) % 20183);
    return erosionLevels.map((i) => i % 3);
  }

  part1({ depth, target: { x, y } }) {
    const map = this.generateMap({ depth, target: { x, y }, width: x + 1, height: y + 1 });
    return map.reduce((sum, t) => sum + t, 0);
  }

  part2({ depth, target: { x, y } }) {
    // Optimise bounds now we know how far we go on the best route
    const width = Math.min(x * 3, 38);
    const height = Math.min(y * 1.3, 761);
    const map = this.generateMap({ depth, target: { x, y }, width, height });
    const adjacency = buildAdjacencyMap({ length: map.length, width, adjacency: 4 });

    const toolsAllowed = [
      ['T', 'C'],
      ['C', 'N'],
      ['T', 'N'],
    ];

    const start = '0:0:T';

    const route = aStarSearch({
      start,
      goal: `${x}:${y}:T`,
      d: (from, to) => (from.endsWith(to.slice(-1)) ? 1 : 7),
      h: (sq) => {
        const [xx, yy, tool] = sq.split(':');
        return Math.abs(x - xx) + Math.abs(y - yy) + (tool === 'T' ? 0 : 7);
      },
      neighbours: (sq) => {
        const [xs, ys, tool] = sq.split(':');
        const [xx, yy] = [Number(xs), Number(ys)];
        const ix = xx + yy * width;
        const adjacentIndexes = adjacency[ix];

        const currentType = map[ix];
        const switchTool = toolsAllowed[currentType].find((t) => t !== tool);
        const allowedTypes = toolsAllowed.map((tt, iix) => (tt.includes(tool) ? iix : -1)).filter((iix) => iix >= 0);

        return [
          `${xx}:${yy}:${switchTool}`,
          ...adjacentIndexes
            .filter((iix) => allowedTypes.includes(map[iix]))
            .map((iix) => `${iix % width}:${~~(iix / width)}:${tool}`),
        ];
      },
      searchSpaceSize: width * height * 2,
    });

    return route
      .slice(1)
      .reduce(({ total, prev }, sq) => ({ total: total + (sq.endsWith(prev.slice(-1)) ? 1 : 7), prev: sq }), {
        total: 0,
        prev: start,
      }).total;
  }
}
