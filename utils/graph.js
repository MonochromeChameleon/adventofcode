import { permutations } from './array-utils.js';

export class Graph {
  constructor() {
    this.links = {};
  }

  addEdge({ from, to, distance }) {
    this._allRoutes = undefined;
    this.links[from] = this.links[from] || {};
    this.links[from][to] = distance;

    if (!this.isDirected) {
      this.links[to] = this.links[to] || {};
      this.links[to][from] = distance;
    }

    return this;
  }

  get nodes() {
    return Object.keys(this.links);
  }

  get allRoutes() {
    if (!this._allRoutes) {
      const routes = this.isDirected ? permutations(this.nodes) : permutations(this.nodes).filter(route => {
        const first = route[0];
        const last = route[route.length - 1];
        return first.localeCompare(last) < 0;
      });
      this._allRoutes = routes.map((r) => this.calculateRoute(...r));
    }
    return this._allRoutes;
  }

  calculateRoute(previous, ...route) {
    const start = this.closedRoute ? this.links[route[route.length - 1]][previous] : 0;
    const { distance } = route.reduce(({ distance, previous }, next) => {
      return {
        distance: distance + this.links[previous][next],
        previous: next,
      };
    }, { distance: start, previous });
    return { distance, route };
  }
}
