import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 12, 1473620, 902620);

    this.exampleInput({ part1: 140, part2: 80 });
    this.exampleInput({ part1: 772, part2: 436 });
    this.exampleInput({ part1: 1930, part2: 1206 });
    this.exampleInput({ part2: 236 });
    this.exampleInput({ part2: 368 });
  }

  get parser() {
    return Parsers.GRID;
  }

  collectRegion(ix, grid, adjacencyMap, region = [ix]) {
    return adjacencyMap[ix].filter((aix) => grid[aix] === grid[ix])
      .filter((aix) => !region.includes(aix))
      .reduce((r, aix) => this.collectRegion(aix, grid, adjacencyMap, [...r, aix]), region);
  }

  collectRegions(grid, adjacencyMap) {
    const seen = new Set();
    return grid.reduce((regions, v, ix) => {
      if (seen.has(ix)) return regions;
      const region = [... new Set(this.collectRegion(ix, grid, adjacencyMap))].sort((a, b) => a - b);
      region.forEach((r) => seen.add(r));
      return [...regions, region]
    }, [])
  }

  priceRegion(region, adjacencyMap) {
    const walls = region.map((rix) => 4 - adjacencyMap[rix].filter((aix) => region.includes(aix)).length).reduce((a, b) => a + b, 0);
    return walls * region.length;
  }

  flagSides(ix, region, width) {
    return {
      hasTop: !region.includes(ix - width),
      hasLeft: ix % width === 0 || !region.includes(ix - 1),
      hasRight: ix % width === width - 1 || !region.includes(ix + 1),
      hasBottom: !region.includes(ix + width),
    }
  }

  countWalls(region, adjacencyMap, width) {
    return region.map((ix) => {
      const flags = this.flagSides(ix, region, width);
      const isNewTop = flags.hasTop && (!adjacencyMap[ix].includes(ix - 1) || !region.includes(ix - 1) || region.includes(ix - width - 1));
      const isNewLeft = flags.hasLeft && (!region.includes(ix - width) || (ix % width > 0 && region.includes(ix - width - 1)));
      const isNewRight = flags.hasRight && (!region.includes(ix - width) || (ix % width < width - 1 && region.includes(ix - width + 1)));
      const isNewBottom = flags.hasBottom && (!adjacencyMap[ix].includes(ix - 1) || !region.includes(ix - 1) || region.includes(ix + width - 1));

      return [isNewTop, isNewLeft, isNewRight, isNewBottom].filter(Boolean).length;
    }).reduce((a, b) => a + b, 0);
  }

  bulkPriceRegion(region, adjacencyMap, width) {
    const walls = this.countWalls(region, adjacencyMap, width);
    return walls * region.length;
  }

  part1({ grid, adjacencyMap }) {
    return this.collectRegions(grid, adjacencyMap).map((region) => this.priceRegion(region, adjacencyMap)).reduce((a, b) => a + b, 0);
  }

  part2({ grid, adjacencyMap, width }) {
    return this.collectRegions(grid, adjacencyMap).map((region) => this.bulkPriceRegion(region, adjacencyMap, width)).reduce((a, b) => a + b, 0);
  }
}
