import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { Graph } from '../../utils/graph.js';

class Volcano extends Graph {
  constructor() {
    super();
    this.flowRates = {};
  }

  addLine(line) {
    const [, valve, rate, links] = /^Valve (.+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/.exec(line);
    links.split(',').forEach((to) => this.addEdge({ from: valve, to: to.trim(), distance: 1 }));
    this.flowRates[valve] = Number(rate);
  }

  neighbours(node) {
    const { location, open, released, time } = node;
    return this.valvesThatMatter
      .filter((v) => !open.includes(v))
      .filter((v) => this.links[location][v] < time)
      .map((v) => {
        const remainingTime = time - (this.links[location][v] + 1);
        return {
          location: v,
          open: [...open, v].sort((a, b) => a.localeCompare(b)),
          released: released + (this.flowRates[v] * remainingTime),
          state: [...open, v].join(':'),
          time: remainingTime
        }
      });
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2022, 16, 1474, 2100);

    this.exampleInput({ filename: '16a', part1: 1651, part2: 1707 });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Volcano;
  }

  postParse(input) {
    // FUN FACT: THIS ISN'T EXHAUSTIVE BUT IT DOES ENOUGH
    input.nodes.forEach((node) => Object.keys(input.links[node])
      .forEach((link) => Object.keys(input.links[link])
        .filter((ll) => ll !== node && (input.links[node][ll] || Infinity) > input.links[node][link] + input.links[link][ll])
        .forEach((ll) => input.addEdge({ from: node, to: ll, distance: input.links[node][link] + input.links[link][ll] }))));

    input.valvesThatMatter = input.nodes.filter((n) => input.flowRates[n]);

    return input;
  }

  bfs(volcano, location, time) {
    const queue = volcano.neighbours({ location, open: [], released: 0, time });
    const explored = {};

    while (queue.length) {
      const current = queue.pop();
      explored[current.state] = current.released;

      volcano.neighbours(current)
        .filter((neighbour) => neighbour.released > (explored[neighbour.state] || 0))
        .forEach((neighbour) => queue.push(neighbour));
    }

    return explored;
  }

  part1(input, location = 'AA', time = 30) {
    const results = this.bfs(input, location, time);
    return Object.values(results).reduce((a, b) => Math.max(a, b), 0);
  }

  part2(input, location = 'AA', time = 26) {
    const results = this.bfs(input, location, time);
    const bestByValveSet = Object.fromEntries(
      Object.entries(results)
        .filter(([, v]) => v)
        .map(([k, v]) => [k.split(':').sort((a, b) => a.localeCompare(b)).join(':'), v])
        .sort(([, a], [, b]) => a - b));

    return Object.entries(bestByValveSet)
      .map(([k, v]) => ({ open: k.split(':'), released: v }))
      .reduce((best, { open, released }, ix, all) => {
        const bestOfTheRest = all.slice(ix + 1)
          .filter(({ released: next }) => released + next > best)
          .filter(({ open: next }) => next.every((n) => !open.includes(n)))
          .reduce((a, { released: next }) => Math.max(a, next), 0) + released;
        return Math.max(best, bestOfTheRest);
      }, 0);
  }
}
