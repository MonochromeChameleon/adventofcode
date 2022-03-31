import { QuestionBase } from '../../utils/question-base.js';
import { hexagonalSpace } from '../../utils/hexagonal-space.js';
import { Vector } from '../../utils/vector.js';

const { NORTH_EAST, EAST, SOUTH_EAST, SOUTH_WEST, WEST, NORTH_WEST, neighbours } = hexagonalSpace;

export class Question extends QuestionBase {
  constructor() {
    super(2020, 24, 289, 3551);

    this.exampleInput({ part1: 10 });
    this.exampleInput({ filename: '24a', part2: 15 }, 1);
    this.exampleInput({ filename: '24a', part2: 12 }, 2);
    this.exampleInput({ filename: '24a', part2: 25 }, 3);
    this.exampleInput({ filename: '24a', part2: 14 }, 4);
    this.exampleInput({ filename: '24a', part2: 23 }, 5);
    this.exampleInput({ filename: '24a', part2: 28 }, 6);
    this.exampleInput({ filename: '24a', part2: 41 }, 7);
    this.exampleInput({ filename: '24a', part2: 37 }, 8);
    this.exampleInput({ filename: '24a', part2: 49 }, 9);
    this.exampleInput({ filename: '24a', part2: 37 }, 10);
    this.exampleInput({ filename: '24a', part2: 132 }, 20);
    this.exampleInput({ filename: '24a', part2: 259 }, 30);
    this.exampleInput({ filename: '24a', part2: 406 }, 40);
    this.exampleInput({ filename: '24a', part2: 566 }, 50);
    this.exampleInput({ filename: '24a', part2: 788 }, 60);
    this.exampleInput({ filename: '24a', part2: 1106 }, 70);
    this.exampleInput({ filename: '24a', part2: 1373 }, 80);
    this.exampleInput({ filename: '24a', part2: 1844 }, 90);
    this.exampleInput({ filename: '24a', part2: 2208 }, 100);
  }

  parseLine(line) {
    return line.split('').reduce(
      ({ ns, pos }, char) => {
        switch (ns) {
          case 'n':
            switch (char) {
              case 'e':
                return { ns: null, pos: pos.add(NORTH_EAST) };
              case 'w':
                return { ns: null, pos: pos.add(NORTH_WEST) };
              default:
                throw new Error(`Unexpected character: ${char}`);
            }
          case 's':
            switch (char) {
              case 'e':
                return { ns: null, pos: pos.add(SOUTH_EAST) };
              case 'w':
                return { ns: null, pos: pos.add(SOUTH_WEST) };
              default:
                throw new Error(`Unexpected character: ${char}`);
            }
          default:
            switch (char) {
              case 'e':
                return { ns: null, pos: pos.add(EAST) };
              case 'w':
                return { ns: null, pos: pos.add(WEST) };
              default:
                return { ns: char, pos };
            }
        }
      },
      { ns: null, pos: new Vector(0, 0, 0) }
    ).pos;
  }

  generation(blackTiles) {
    const blackIds = new Set(blackTiles.map((bt) => bt.toString()));
    const whiteIds = new Set();

    const blackSurvivors = blackTiles.filter((tile) =>
      [1, 2].includes(neighbours(tile).filter((n) => blackIds.has(n.toString())).length)
    );
    const whiteTiles = blackTiles
      .flatMap((tile) => neighbours(tile).filter((n) => !blackIds.has(n.toString())))
      .reduce((wts, tile) => {
        if (whiteIds.has(tile.toString())) return wts;
        whiteIds.add(tile.toString());
        return wts.concat(tile);
      }, []);
    const whiteFlips = whiteTiles.filter(
      (tile) => neighbours(tile).filter((n) => blackIds.has(n.toString())).length === 2
    );

    return [...blackSurvivors, ...whiteFlips];
  }

  part1(input) {
    const blackTiles = input.reduce((blk, t) => {
      if (blk.some((bt) => bt.equals(t))) return blk.filter((bt) => !bt.equals(t));
      return [...blk, t];
    }, []);

    return blackTiles.length;
  }

  part2(input, turns = 100) {
    const blackTiles = input.reduce((blk, t) => {
      if (blk.some((bt) => bt.equals(t))) return blk.filter((bt) => !bt.equals(t));
      return [...blk, t];
    }, []);

    return Array.from({ length: turns }).reduce((acc) => this.generation(acc), blackTiles).length;
  }
}
