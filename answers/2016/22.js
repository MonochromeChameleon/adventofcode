import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Maze } from '../../utils/maze.js';

export class Question extends QuestionBase {
  constructor() {
    super(2016, 22, 985, 179);

    this.exampleInput({ filename: '22a', part2: 7 });
  }

  get parser() {
    return Parsers.MULTI_LINE_MAP;
  }

  map(line) {
    if (!line.startsWith('/dev/grid')) return undefined;
    const [, ...values] = /\/dev\/grid\/node-x(\d+)-y(\d+) +(\d+)T +(\d+)T +(\d+)T +(\d+)%/.exec(line);
    const [x, y, size, used, avail, use] = values.map(Number);
    return {
      x,
      y,
      size,
      used,
      avail,
      use,
      toString() {
        if (!used) return '_';
        if (used > 100) return '#';
        return '.';
      },
    };
  }

  part1(nodes) {
    return nodes
      .filter(({ used }) => used)
      .reduce((tot, { used }) => tot + nodes.filter(({ avail }) => avail >= used).length, 0);
  }

  part2(nodes) {
    const xMax = nodes.reduce((max, { x }) => Math.max(max, x), 0);
    const maze = new Maze({
      squares: nodes.sort((a, b) => a.y - b.y || a.x - b.x).map((n) => n.toString()),
      width: xMax + 1,
      height: nodes.length / (xMax + 1),
    });
    const distToTopCorner = maze.distance(maze.find('_'), xMax);
    return (xMax - 1) * 5 + distToTopCorner;
  }
}
