import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';
import { Maybe } from '../../utils/maybe.js';

export class Question extends QuestionBase {
  constructor() {
    super(2019, 18, 6162, 1556);

    this.exampleInput({ filename: '18a', part1: 8 });
    this.exampleInput({ filename: '18b', part1: 86 });
    this.exampleInput({ filename: '18c', part1: 132 });
    this.exampleInput({ filename: '18d', part1: 136 });
    this.exampleInput({ filename: '18e', part1: 81 });

    this.exampleInput({ filename: '18f', part2: 8 });
    this.exampleInput({ filename: '18g', part2: 24 });
    this.exampleInput({ filename: '18h', part2: 32 });
    this.exampleInput({ filename: '18i', part2: 72 });
  }

  get parser() {
    return Parsers.MAZE;
  }

  splitQuadrants(maze) {
    const start = maze.squares.findIndex((s) => s === '@');

    [-1, 0, 1]
      .flatMap((dx) => [-1, 0, 1].map((dy) => [dx, dy]))
      .forEach(([dx, dy]) => {
        maze.squares[start + dx + dy * maze.width] = dx && dy ? '@' : '#';
      });
  }

  completeKeyMaze(start, maze) {
    const starts = maze.squares.reduce((ss, sq, ix) => (sq === '@' ? [...ss, ix] : ss), []);
    const keys = maze.nonStandardSquares.filter((s) => s.match(/[a-z]/)).sort();
    const quadrants = Object.fromEntries(keys.map((k) => [k, starts.findIndex((ii) => maze.route(ii, k).hasValue())]));

    const findRoute = (tgt) => starts.reduce((r, s) => r.maybeBaby(() => maze.route(s, tgt)), Maybe.empty());
    const findBlockages = (tgt) =>
      findRoute(tgt)
        .map((rte) =>
          rte
            .filter((ix) => maze.squares[ix].match(/[a-zA-Z]/))
            .map((ix) => maze.squares[ix].toLowerCase())
            .filter((it) => it !== tgt),
        )
        .orElse([]);

    const blockages = keys.reduce((b, k) => ({ ...b, [k]: findBlockages(k) }), {});

    const end = (current) => current.length === keys.length + start.length;

    const neighbours = (current) => {
      const availableKeys = keys.filter((k) => !current.includes(k) && blockages[k].every((b) => current.includes(b)));
      const prefixes = current.split(':');
      return availableKeys.map((k) =>
        prefixes.map((p, ix) => (ix === quadrants[k] ? `@${p.slice(1).split('').sort().join('')}${k}` : p)).join(':'),
      );
    };

    const distances = ['@', ...keys].reduce(
      (d, from) =>
        ['@', ...keys].reduce((dd, to) => {
          const key = `${from}-${to}`;
          if (from === to) return { ...dd, [key]: 0 };
          if (dd[`${to}-${from}`]) return { ...dd, [key]: dd[`${to}-${from}`] };

          const froms = from === '@' ? starts : [from];
          return froms
            .reduce((m, s) => m.maybeBaby(() => maze.distance(s, to)), Maybe.empty())
            .map((dist) => ({ ...dd, [key]: dist }))
            .orElse(dd);
        }, d),
      {},
    );

    const distance = (from, to) => {
      const qf = from.split(':');
      const qt = to.split(':');

      const qi = qf.findIndex((q, ix) => q !== qt[ix]);
      const f = qf[qi][qf[qi].length - 1];
      const t = qt[qi][qt[qi].length - 1];

      return distances[`${f}-${t}`];
    };

    return dijkstra({ start, end, neighbours, distance }).getOrThrow();
  }

  part1(maze) {
    return this.completeKeyMaze('@', maze);
  }

  part2(maze) {
    this.splitQuadrants(maze);
    return this.completeKeyMaze('@:@:@:@', maze);
  }
}
