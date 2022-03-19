import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';

export class Question extends QuestionBase {
  constructor() {
    super(2019, 18, 6162, 1556);
    this.wip = true;

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

  part1(maze) {
    const start = maze.squares.findIndex((s) => s === '@');
    const keys = maze.nonStandardSquares.filter((s) => s.match(/[a-z]/)).sort();

    const findBlockages = (tgt) => maze.route(start, tgt).filter((ix) => maze.squares[ix].match(/[a-zA-Z]/)).map((ix) => maze.squares[ix].toLowerCase()).filter((it) => it !== tgt);

    const blockages = keys.reduce((b, k) => ({ ...b, [k]: findBlockages(k) }), {});

    const goal = (current) => current.length === keys.length + 1;

    const neighbours = (current) => {
      const availableKeys = keys.filter((k) => !current.includes(k) && blockages[k].every((b) => current.includes(b)));
      const prefix = current.slice(1).split('').sort().join('');
      return availableKeys.map((k) => `@${prefix}${k}`);
    };

    const distances = ['@', ...keys].reduce((d, from) => {
      return ['@', ...keys].reduce((dd, to) => {
        const key = `${from}-${to}`;
        if (from === to) {
          dd[key] = 0;
          return dd;
        }

        dd[key] = dd[`${to}-${from}`] || maze.route(maze.squares.indexOf(from), maze.squares.indexOf(to)).length - 1;
        return dd;
      }, d);
    }, {});

    const distance = (from, to) => distances[`${from[from.length - 1]}-${to[to.length - 1]}`];

    return dijkstra({ start: '@', goal, neighbours, distance, output: 'distance' });
  }

  part2(maze) {
    const start = maze.squares.findIndex((s) => s === '@');
    [-1, 0, 1].flatMap((dx) => [-1, 0, 1].map((dy) => [dx, dy])).forEach(([dx, dy]) => {
      maze.squares[start + dx + (dy * maze.width)] = dx && dy ? '@' : '#';
    });

    const starts = [-1, 1].flatMap((dx) => [-1, 1].map((dy) => [dx, dy])).map(([dx, dy]) => start + dx + (dy * maze.width));
    const keys = maze.nonStandardSquares.filter((s) => s.match(/[a-z]/)).sort();

    const findRoute = (tgt) => starts.reduce((r, s) => {
      if (r) return r;
      try {
        return maze.route(s, tgt);
      } catch (e) {
        return null;
      }
    }, null);

    const quadrants = Object.fromEntries(keys.map((k) => [k, [0, 1, 2, 3].find((ii) => {
      try {
        maze.route(starts[ii], k);
        return true;
      } catch (e) {
        return false;
      }
    })]))

    const findDistance = (from, to) => {
      try {
        return maze.route(from, to).length - 1;
      } catch (e) {
        return undefined;
      }
    }

    const findBlockages = (tgt) => findRoute(tgt).filter((ix) => maze.squares[ix].match(/[a-zA-Z]/)).map((ix) => maze.squares[ix].toLowerCase()).filter((it) => it !== tgt);
    const blockages = keys.reduce((b, k) => ({ ...b, [k]: findBlockages(k) }), {});

    const goal = (current) => current.length === keys.length + 7;

    const neighbours = (current) => {
      const availableKeys = keys.filter((k) => !current.includes(k) && blockages[k].every((b) => current.includes(b)));
      const prefixes = current.split(':');
      return availableKeys.map((k) => prefixes.map((p, ix) => ix === quadrants[k] ? `@${p.slice(1).split('').sort().join('')}${k}` : p).join(':'));
    };

    const distances = ['@', ...keys].reduce((d, from) => {
      return ['@', ...keys].reduce((dd, to) => {
        const key = `${from}-${to}`;
        if (from === to) {
          dd[key] = 0;
          return dd;
        }

        dd[key] = dd[`${to}-${from}`]
        if (!dd[key]) {
          if (from === '@') {
            dd[key] = starts.reduce((d, s) => d || findDistance(s, to), 0);
          } else {
            dd[key] = findDistance(from, to);
          }
        }
        return dd;
      }, d);
    }, {});

    const distance = (from, to) => {
      const qf = from.split(':');
      const qt = to.split(':');

      const qi = qf.findIndex((q, ix) => q !== qt[ix]);
      const f = qf[qi][qf[qi].length - 1];
      const t = qt[qi][qt[qi].length - 1];

      return distances[`${f}-${t}`];
    }

    return dijkstra({ start: '@:@:@:@', goal, neighbours, distance, output: 'distance' });
  }
}
