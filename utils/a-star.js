import { PriorityQueue } from './priority-queue.js';

export function reconstructPath(cameFrom, current) {
  const totalPath = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    totalPath.unshift(current);
  }
  return totalPath;
}

export function aStarSearch(start, goal, d, h, neighbours, searchSpaceSize = goal) {
  const gScore = Array.from({ length: searchSpaceSize }).fill(Infinity);
  gScore[start] = 0;

  const fScore = Array.from({ length: searchSpaceSize }).fill(Infinity);
  fScore[start] = 0;

  const openSet = new PriorityQueue((a, b) => fScore[a] < fScore[b]);
  openSet.push(start);

  const cameFrom = {};

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    if (current === goal) {
      return reconstructPath(cameFrom, current);
    }

    for (const neighbour of neighbours(current)) {
      const tentativeGScore = gScore[current] + d(current, neighbour);
      if (tentativeGScore >= gScore[neighbour]) continue; // eslint-disable-line no-continue
      cameFrom[neighbour] = current;
      gScore[neighbour] = tentativeGScore;
      fScore[neighbour] = gScore[neighbour] + h(neighbour);
      openSet.push(neighbour);
    }
  }

  throw new Error('No path found');
}
