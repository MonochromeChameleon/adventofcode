import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Graph } from '../../utils/graph.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 24, 448, 672);

    this.exampleInput({ part1: 14 });
  }

  get parser() {
    return Parsers.MAZE;
  }

  buildGraph(maze, closed = false) {
    const waypoints = maze.nonStandardSquares.sort();
    const graph = new Graph({ closed });

    for (let i = 0; i < waypoints.length; i += 1) {
      const from = waypoints[i];
      for (let j = i + 1; j < waypoints.length; j += 1) {
        const to = waypoints[j];
        graph.addEdge({ from, to, distance: maze.distance(from, to).getOrThrow() });
      }
    }

    return graph;
  }

  part1(maze) {
    const graph = this.buildGraph(maze);
    return graph.allRoutes
      .filter(({ route: [start] }) => start === '0')
      .map(({ distance }) => distance)
      .reduce((a, b) => Math.min(a, b));
  }

  part2(maze) {
    const graph = this.buildGraph(maze, true);
    return graph.allRoutes
      .filter(({ route: [start] }) => start === '0')
      .map(({ distance }) => distance)
      .reduce((a, b) => Math.min(a, b));
  }
}
