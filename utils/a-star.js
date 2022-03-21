import { PriorityQueue } from './priority-queue.js';
import { Maybe } from './maybe.js';

export function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
}

export function aStarSearch({ start, end, d = () => 1, h, neighbours, searchSpaceSize = end, output = 'route' }) {
  const isEnd = typeof end === 'function' ? end : (maybeEnd) => end === maybeEnd;
  const gScore = Array.from({ length: searchSpaceSize }).fill(Infinity);
  gScore[start] = 0;

  const fScore = Array.from({ length: searchSpaceSize }).fill(Infinity);
  fScore[start] = 0;

  const openSet = new PriorityQueue((a, b) => fScore[a] < fScore[b]);
  openSet.push(start);

  const cameFrom = {};

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    if (isEnd(current)) {
      switch (output) {
        case 'route':
          return Maybe.of(reconstructPath(cameFrom, current));
        case 'distance':
          return Maybe.of(gScore[current]);
        case 'endpoint':
          return Maybe.of(current);
      }
    }

    neighbours(current).forEach((neighbour) => {
      const tentativeGScore = gScore[current] + d(current, neighbour);
      if (tentativeGScore >= gScore[neighbour]) {
        // no-op - this is a sneaky way to handle infinite paths where we can't fill the gScore
      } else {
        cameFrom[neighbour] = current;
        gScore[neighbour] = tentativeGScore;
        fScore[neighbour] = gScore[neighbour] + h(neighbour);
        openSet.push(neighbour);
      }
    });
  }

  return Maybe.empty();
}
