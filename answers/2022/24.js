import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';
import { buildAdjacencyMap, shrinkGrid } from '../../utils/grid-utils.js';
import { lcm } from '../../utils/number-utils.js';

export class Question extends QuestionBase {
  constructor() {
    super(2022, 24, 334, 934);

    this.exampleInput({ filename: '24a', part1: 18, part2: 54 });
  }

  get parser() {
    return Parsers.GRID;
  }

  get adjacency() {
    return 5;
  }

  availableMoves(i, repeat, grids, width, adjacencyMap) {
    const x = Math.floor(i / repeat);
    const steps = (i + 1) % repeat;
    const grid = grids[steps];
    return adjacencyMap[x].filter((ii) => grid[ii] === '.').map((ii) => ii * repeat + steps);
  }

  moveBlizzard(char, ix, steps, width, length) {
    switch (char) {
      case '.':
      case '#':
        return ix;
      case '>':
        return width * Math.floor(ix / width) + ((ix + steps) % width);
      case '<':
        return width * Math.floor(ix / width) + ((ix + length - steps) % width);
      case '^':
        return (ix + width * length - steps * width) % length;
      case 'v':
        return (ix + width * steps) % length;
    }
  }

  postParse({ grid, width, height }) {
    const shrunkGrid = shrinkGrid({ grid, width });
    const repeat = lcm(width - 2, height - 2);
    const repeatGrids = Array.from({ length: repeat }, (_, steps) => shrunkGrid.reduce(
      (out, char, ix) => {
        const iix = this.moveBlizzard(char, ix, steps, width - 2, shrunkGrid.length);
        out[iix] = out[iix] === '.' ? shrunkGrid[ix] : out[iix];
        return out;
      },
      shrunkGrid.map(() => '.')
    ));

    const adjacencyMap = buildAdjacencyMap({
      length: shrunkGrid.length,
      width: width - 2,
      adjacency: 5
    });

    return { grids: repeatGrids, repeat, width: width - 2, adjacencyMap };
  }

  part1({ grids, repeat, width, adjacencyMap }, start = 1, end = grids[0].length - 1) {
    const distance = dijkstra({
      start,
      end: (i) => Math.floor(i / repeat) === end,
      neighbours: (ix) => this.availableMoves(ix, repeat, grids, width, adjacencyMap)
    }).orElse(-3);

    return distance + 2;
  }

  part2({ grids, repeat, width, adjacencyMap }) {
    const there = this.part1({ grids, repeat, width, adjacencyMap });
    const back = Array.from({ length: repeat }, (_, ix) => ix).find(
      (ix) =>
        this.part1(
          { grids, repeat, width, adjacencyMap },
          (grids[0].length - 1) * repeat + ((ix + there) % repeat),
          0
        ) > 0
    );
    const goBack = this.part1(
      { grids, repeat, width, adjacencyMap },
      (grids[0].length - 1) * repeat + ((there + back) % repeat),
      0
    );
    const thereAgain = Array.from({ length: repeat }, (_, ix) => ix).find(
      (ix) => this.part1({
        grids,
        repeat,
        width,
        adjacencyMap
      }, (there + back + goBack + ix) % repeat) > 0
    );
    const goThereAgain = this.part1(
      { grids, repeat, adjacencyMap, width },
      (there + back + goBack + thereAgain) % repeat
    );
    return there + back + goBack + thereAgain + goThereAgain - 1;
  }
}
