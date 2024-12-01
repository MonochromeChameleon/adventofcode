import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 21, 3737, 625382480005896);

    this.exampleInput({ part1: 16 }, 6);
    // this.exampleInput({ filename: '21a', part2: 16 }, 6);
    // this.exampleInput({ filename: '21a', part2: 50 }, 10);
    // this.exampleInput({ filename: '21a', part2: 1594 }, 50);
    // this.exampleInput({ filename: '21a', part2: 6536 }, 100);
    // this.exampleInput({ filename: '21a', part2: 167004 }, 500);
    // this.exampleInput({ filename: '21a', part2: 668697 }, 1000);
    // this.exampleInput({ filename: '21a', part2: 16733044 }, 5000);
  }

  get parser() {
    return Parsers.GRID;
  }

  part1({ grid, adjacencyMap }, steps = 64) {
    const start = grid.findIndex((c) => c === 'S');
    return Array.from({ length: steps })
      .reduce((positions) => new Set([...positions].flatMap((ix) => adjacencyMap[ix]).filter((ix) => grid[ix] !== '#')), new Set([start]))
      .size;
  }

  calculateRange(grid, adjacency, start, width) {
    const edges = Object.fromEntries(grid.map((c, ix) => c === '.' && adjacency[ix].length < 4 ? [ix, undefined] : undefined).filter(Boolean));
    const reached = {};
    let current = [start];
    let stepsTaken = 0;
    let r131;
    while (Object.values(edges).some((e) => e === undefined) || !(JSON.stringify(current) in reached)) {
      reached[JSON.stringify(current)] ||= stepsTaken;
      stepsTaken += 1;
      current = [...new Set(current.flatMap((r) => adjacency[r]))].filter((r) => grid[r] !== '#').sort((a, b) => a - b);
      current.filter((c) => c in edges && !edges[c]).forEach((c) => {
        edges[c] = stepsTaken;
      });
      if (stepsTaken === width) r131 = current;
    }
    const repeat = reached[JSON.stringify(current)];
    const next = JSON.parse(Object.keys(reached).find((k) => reached[k] === repeat + 1));

    return {
      edges,
      repeat,
      odd: (repeat % 2 === 1 ? current : next).length,
      even: (repeat % 2 === 1 ? next : current).length,
      r131: r131.length
    };
  }

  part2({ grid, adjacencyMap, width, lines }, steps = 26501365) {
    // JUST WRONG
    // 625385642573021 too high
    // 625385642549757 too high
    // 625385642533965 wrong
    // 625382447867213 too low
    const start = grid.findIndex((c) => c === 'S');
    // const fromStart = this.calculateRange(grid, adjacencyMap, start, width);
    // const fromMiddle = this.calculateRange(grid, adjacencyMap, start % width, width);
    // const fromCorner = this.calculateRange(grid, adjacencyMap, 0, width);
    //
    // const repeats = Math.floor((steps - (start % width)) / width);
    // const t = (triangle(repeats - 1) + repeats) * 2;
    // return fromStart.odd + (t * (fromMiddle.odd + fromMiddle.even)) + (4 * (repeats - 2) * fromCorner.r131)  + (4 * fromMiddle.r131)

    // From https://github.com/surgi1/adventofcode/blob/main/2023/day21/script.js

    // 625382480005896
    const mod = (n, m) => ((n % m) + m) % m;

    let pos = {};

    const DS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    const k = (x, y) => x + '_' + y;

    let map = lines.map((line, y) => line.split('').map((v, x) => {
      if (v === 'S') {
        pos[k(x, y)] = [x, y];
      }
      return v;
    }));

    const step = pos => {
      let newPos = {};
      Object.values(pos).forEach(([x, y]) => {
        DS.forEach(([dx, dy]) => {
          if (map[mod(y + dy, width)][mod(x + dx, width)] !== '#') newPos[k(x + dx, y + dy)] = [x + dx, y + dy];
        });
      });
      return newPos;
    };

    const vals = [];

    for (let i = 1; i <= 131 * 2 + 65; i++) {
      pos = step(pos);
      if (i % 131 === 65) {
        vals.push(Object.keys(pos).length);
        console.log(i, (i - 65) / 131, Object.keys(pos).length);
      }
    }

    // taken from day9
    const diffs = row => row.map((v, i) => v - row[i - 1]).slice(1);
    const run = arr => arr.map(step => {
      while (step.some(v => v !== 0)) {
        step = diffs(step);
        arr.push(step);
      }
      return arr.map(v => v[0]);
    });
    const ks = run([vals])[0];

    console.log('polynom coeficients', ks);

    const repeats = Math.floor(steps / width);

    return ks[0] + ks[1] * repeats + repeats * (repeats - 1) * ks[2] / 2;
  }
}
