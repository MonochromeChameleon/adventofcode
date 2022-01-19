import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Graph } from '../../utils/graph.js';

class TablePlan extends Graph {
  get closedRoute() {
    return true;
  }

  get isDirected() {
    return true;
  }

  addLine(line) {
    const [, from, negate, happiness, to] = /^(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)\.$/.exec(
      line
    );
    const distance = negate === 'gain' ? Number(happiness) : -Number(happiness);
    this.addEdge({ from, to, distance });
  }

  get combinedRoutes() {
    return this.allRoutes.reduce((routes, { distance, route }) => {
      const isForward = route[0].localeCompare(route[route.length - 1]) < 0;
      const key = isForward ? route.join('-') : route.reverse().join('-');
      routes[key] = (routes[key] || 0) + distance;
      return routes;
    }, {});
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 13, 664, 640);

    this.exampleInput({ filename: '13a', part1: 330 });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return TablePlan;
  }

  part1(tablePlan) {
    return Object.values(tablePlan.combinedRoutes).reduce((max, value) => Math.max(max, value), 0);
  }

  part2(tablePlan) {
    tablePlan.nodes.forEach((node) => {
      tablePlan.addEdge({ from: 'Me', to: node, distance: 0 });
      tablePlan.addEdge({ from: node, to: 'Me', distance: 0 });
    });
    return Object.values(tablePlan.combinedRoutes).reduce((max, value) => Math.max(max, value), 0);
  }
}
