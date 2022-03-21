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

export function dijkstra({ start, end, neighbours, distance = () => 1, output = 'distance' }) {
  const isEnd = typeof end === 'function' ? end : (maybeEnd) => end === maybeEnd;

  const openSet = new PriorityQueue((a, b) => a.distance < b.distance);
  openSet.push({ id: start, distance: 0 });

  const explored = new Set();

  const cameFrom = {};

  while (!openSet.isEmpty()) {
    const { id: current, distance: dist } = openSet.pop();
    if (isEnd(current)) {
      switch (output) {
        case 'route':
          return Maybe.of(reconstructPath(cameFrom, current));
        case 'endpoint':
          return Maybe.of(current);
        case 'distance':
          return Maybe.of(dist);
      }
    }
    explored.add(current);

    neighbours(current).forEach((neighbour) => {
      const existing = openSet._heap.find(({ id }) => id === neighbour);
      if (!explored.has(neighbour) && !existing) {
        openSet.push({ id: neighbour, distance: dist + distance(current, neighbour) });
        cameFrom[neighbour] = current;
      } else if (existing) {
        const newDistance = dist + distance(current, neighbour);
        if (newDistance < existing.distance) {
          openSet.push({ id: neighbour, distance: newDistance });
          cameFrom[neighbour] = current;
        }
      }
    });
  }

  return Maybe.empty();
}
