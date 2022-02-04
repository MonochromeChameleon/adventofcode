import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Graph } from '../../utils/graph.js';

class RouteMap extends Graph {
  addLine(line) {
    const [from, to, distance] = line.replace(' to ', '|').replace(' = ', '|').split('|');
    super.addEdge({ from, to, distance: Number(distance) });
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 9, 117, 909);

    this.exampleInput({ filename: '9a', part1: 605, part2: 982 });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return RouteMap;
  }

  part1(routeMap) {
    return routeMap.allRoutes.reduce((a, { distance: b }) => Math.min(a, b), Infinity);
  }

  part2(routeMap) {
    return routeMap.allRoutes.reduce((a, { distance: b }) => Math.max(a, b), 0);
  }
}
