import { QuestionWithParser } from '../../utils/question-with-parser.js';
import { permutations } from '../../utils/array-utils.js';
import * as Parsers from '../../parsers/parsers.js';

class Network {
  constructor() {
    this.connections = {};
  }

  addLine(line) {
    const [from, to, distance] = line.replace(' to ', '|').replace(' = ', '|').split('|');

    this.connections[from] = this.connections[from] || {};
    this.connections[from][to] = Number(distance);

    this.connections[to] = this.connections[to] || {};
    this.connections[to][from] = Number(distance);

    return this;
  }

  get locations() {
    return Object.keys(this.connections);
  }

  get allRoutes() {
    if (!this._allRoutes) {
      const routes = permutations(this.locations);
      const routesNotReverse = routes.filter(route => {
        const first = route[0];
        const last = route[route.length - 1];
        return first.localeCompare(last) < 0;
      });
      this._allRoutes = routesNotReverse.map((r) => this.calculateRoute(...r));
    }
    return this._allRoutes;
  }

  calculateRoute(...route) {
    const { distance } = route.slice(1).reduce(({ distance, last }, location) => {
      return {
        distance: distance + this.connections[last][location],
        last: location
      };
    }, { distance: 0, last: route[0] });
    return distance;
  }
}

export class Question extends QuestionWithParser {
  constructor() {
    super(2015, 9, 117, 909);

    this.exampleInput({ filename: '9a', part1: 605, part2: 982 });
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Network;
  }

  part1(network) {
    return network.allRoutes.reduce((a, b) => Math.min(a, b));
  }

  part2(network) {
    return network.allRoutes.reduce((a, b) => Math.max(a, b));
  }
}
