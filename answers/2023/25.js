import { QuestionBase } from '../../utils/question-base.js';
import { dijkstra } from '../../utils/dijkstra.js';
import { countByValue } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 25, 555856);

    this.exampleInput({ part1: 54 }, 2);
  }

  parseLine(line) {
    const [from, ...tos] = line.split(/:?\s/);
    return tos.map((to) => [from, to]);
  }

  parseInput(input) {
    const parsed = input.map((line) => this.parseLine(line));
    return parsed.reduce((out, ps) => ps.reduce((acc, [from, to]) => {
      acc[from] ||= [];
      acc[to] ||= [];
      acc[from].push(to);
      acc[to].push(from);
      return acc;
    }, out), {});
  }

  countReachable(nodes, from, excluded) {
    const routes = Object.keys(nodes)
      .map((to) => dijkstra({
        start: from,
        end: to,
        neighbours: (at) => nodes[at].filter((n) => !excluded.includes(`${at}-${n}`) && !excluded.includes(`${n}-${at}`)),
      }));

    return routes.filter((r) => r.hasValue()).length;
  }

  splitInTwo(nodes, from, ...excluded) {
    const routes = Object.keys(nodes)
      .map((to) => dijkstra({
        start: from,
        end: to,
        neighbours: (at) => nodes[at].filter((n) => !excluded.includes(`${at}-${n}`) && !excluded.includes(`${n}-${at}`)),
        output: 'route'
      }));

    if (routes.some((r) => r.isNothing())) {
      return excluded;
    }

    const links = routes.map((r) => r.value).flatMap((r) => r.slice(1).flatMap((n, ix) => [`${r[ix]}-${n}`, `${n}-${r[ix]}`]));
    const counts = countByValue(links);
    const maxValue = Object.values(counts).reduce((a, b) => Math.max(a, b));
    const exc = Object.keys(counts).find((n) => counts[n] === maxValue);
    return this.splitInTwo(nodes, exc.split('-')[1], ...excluded, exc);
  }

  part1(input) {
    const exclusions = this.splitInTwo(input, Object.keys(input)[0]);
    const reachable = this.countReachable(input, Object.keys(input)[0], exclusions);
    return reachable * (Object.keys(input).length - reachable);
  }
}
