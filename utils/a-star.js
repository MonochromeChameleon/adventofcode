import { PriorityQueue } from './priority-queue.js';

export function reconstruct_path(cameFrom, current) {
  const total_path = [current];
  while (current in cameFrom) {
    current = cameFrom[current];
    total_path.unshift(current);
  }
  return total_path;
}

export function aStarSearch(start, goal, d, h, neighbours, searchSpaceSize = goal) {
  const openSet = new PriorityQueue((a, b) => fScore[a] < fScore[b]);
  openSet.push(start);
  const cameFrom = {};

  const gScore = Array.from({ length: searchSpaceSize }).fill(Infinity);
  gScore[start] = 0;

  const fScore = Array.from({ length: searchSpaceSize }).fill(Infinity);
  fScore[start] = 0;

  while (!openSet.isEmpty()) {
    const current = openSet.pop();
    if (current === goal) {
      return reconstruct_path(cameFrom, current);
    }

    for (const neighbour of neighbours(current)) {
      const tentative_gScore = gScore[current] + d(current, neighbour);
      if (tentative_gScore >= gScore[neighbour]) continue;
      cameFrom[neighbour] = current;
      gScore[neighbour] = tentative_gScore;
      fScore[neighbour] = gScore[neighbour] + h(neighbour);
      openSet.push(neighbour);
    }
  }

  throw new Error('No path found');
}
