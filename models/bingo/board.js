const rows = Array.from({ length: 25 })
  .reduce(
    (r, _, ix) => {
      r[~~(ix/5)].push(ix);
      return r;
    },
    Array.from({ length: 5 }).map(() => ([]))
  );

const columns = Array.from({ length: 25 })
  .reduce(
    (r, _, ix) => {
      r[ix%5].push(ix);
      return r;
    },
    Array.from({ length: 5 }).map(() => ([]))
  );

const diagonals = []; // [[0, 6, 12, 18, 24], [4, 8, 12, 16, 20]];

export class Board {
  constructor(calls, callLookup) {
    this.calls = calls;
    this.callLookup = callLookup;
    this.lines = [];
  }

  addLine(line) {
    const numbers = line.split(' ').filter(it => it).map(Number).map(n => ([n, this.callLookup[n]]));
    this.lines.push(...numbers);
  }

  complete() {
    const possibilities = [...rows, ...columns, ...diagonals];
    const completedLines = possibilities.map(p => p.map(ix => this.lines[ix][1]));
    const completedAts = completedLines.map(p => Math.max(...p));
    this.completedAt = Math.min(...completedAts);
  }

  calculate() {
    const unmarked = this.lines.reduce((tot, [v, ix]) => ix > this.completedAt ? tot + v : tot, 0);
    return unmarked * this.calls[this.completedAt];
  }
}
