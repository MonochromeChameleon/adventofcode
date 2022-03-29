import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { shrinkGrid, joinGrids, rotateGrid, flipGrid } from '../../utils/grid-utils.js';

class Tile {
  constructor(id, grid, width, height) {
    this.id = id;
    this.grid = grid;
    this.width = width;
    this.height = height;
  }

  get edges() {
    return [
      this.top,
      this.left,
      this.bottom,
      this.right,
      this.top.split('').reverse().join(''),
      this.left.split('').reverse().join(''),
      this.bottom.split('').reverse().join(''),
      this.right.split('').reverse().join(''),
    ];
  }

  rotate() {
    this.grid = rotateGrid(this);
  }

  flip() {
    this.grid = flipGrid(this);
  }

  get top() {
    return this.grid.slice(0, this.width).join('');
  }

  get left() {
    return Array.from({ length: this.height }, (_, y) => this.grid[y * this.width]).join('');
  }

  get bottom() {
    return this.grid.slice(this.grid.length - this.width, this.grid.length).join('');
  }

  get right() {
    return Array.from({ length: this.height }, (_, y) => this.grid[y * this.width + this.width - 1]).join('');
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2020, 20, 11788777383197, 2242);
    this.wip = true;

    this.exampleInput({ part1: 20899048083289, part2: 273 });

    Parsers.GRID.withMappedProps({ parseInput: 'parseGrid', parseLine: 'g' }).mixin(this);
  }

  get parser() {
    return Parsers.GROUP.withMappedProps({ parseInput: 'parseStuff' });
  }

  get groupSize() {
    return 11;
  }

  parseGroup([header, ...image]) {
    const [, id] = /Tile (\d+):/.exec(header).map(Number);
    const { grid, width, height } = this.parseGrid(image);

    return new Tile(id, grid, width, height);
  }

  findMatches(tile, tiles) {
    return tiles.filter((t) => t !== tile && t.edges.some((e) => tile.edges.includes(e)));
  }

  rotateTo(tile, { top, left }) {
    for (let i = 0; i < 4; i++) {
      if ((!top || tile.top === top) && (!left || tile.left === left)) return tile;
      tile.rotate();
    }
    tile.flip();
    for (let i = 0; i < 4; i++) {
      if ((!top || tile.top === top) && (!left || tile.left === left)) return tile;
      tile.rotate();
    }
    return false;
  }

  findSeaMonsters(grid, width) {
    const topLine = /..................#./;
    const midLine = /#....##....##....###/g;
    const botLine = /.#..#..#..#..#..#.../;

    const matches = [];
    let match = midLine.exec(grid);
    while (match) {
      if (
        match.index % width <= width - 20 &&
        topLine.test(grid.substr(match.index - width, 20)) &&
        botLine.test(grid.substr(match.index + width, 20))
      ) {
        matches.push(match.index - width);
      }
      match = midLine.exec(grid);
    }
    return matches;
  }

  part1(tiles) {
    return tiles
      .filter((tile) => this.findMatches(tile, tiles).length === 2)
      .map(({ id }) => id)
      .reduce((a, b) => a * b);
  }

  part2(tiles) {
    const [firstCorner, ...corners] = tiles.filter((tile) => this.findMatches(tile, tiles).length === 2);
    const edges = tiles.filter((tile) => this.findMatches(tile, tiles).length === 3);
    const middles = tiles.filter((tile) => this.findMatches(tile, tiles).length === 4);
    const width = Math.sqrt(tiles.length);

    const otherEdges = [...corners, ...edges, ...middles].flatMap((tile) => tile.edges);
    while (otherEdges.includes(firstCorner.top) || otherEdges.includes(firstCorner.left)) {
      firstCorner.rotate();
    }

    const tilesInOrder = [...corners, ...edges, ...middles].reduce(
      (tt, _, tix, otherTiles) => {
        const row = ~~((tix + 1) / width);
        const col = (tix + 1) % width;

        const above = row > 0 ? tt[tix + 1 - width] : undefined;
        const left = col > 0 ? tt[tix] : undefined;

        const nextTile = otherTiles
          .filter((t) => !tt.includes(t))
          .find((t) =>
            this.rotateTo(t, {
              top: above?.bottom,
              left: left?.right,
            })
          );
        return [...tt, nextTile];
      },
      [firstCorner]
    );

    const shrunkenTiles = tilesInOrder.map((t) => new Tile(t.ix, shrinkGrid(t), t.width - 2, t.height - 2));
    let megaGrid = joinGrids({
      grids: shrunkenTiles.map((t) => t.grid),
      tileWidth: shrunkenTiles[0].width,
      gridsPerRow: width,
    }).join('');
    const megaWidth = Math.sqrt(megaGrid.length);

    // Somehow I lucked into getting everything the right way round here. Whoop.
    const seaMonsters = this.findSeaMonsters(megaGrid, megaWidth);

    return megaGrid.split('').filter((c) => c === '#').length - seaMonsters.length * 15;
  }
}
