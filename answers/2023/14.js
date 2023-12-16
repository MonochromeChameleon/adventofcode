import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

const NWSE = [new Vector(0, -1), new Vector(-1, 0), new Vector(0, 1), new Vector(1, 0)];

export class Question extends QuestionBase {
  constructor() {
    super(2023, 14, 110821, 83516);

    this.exampleInput({ part1: 136, part2: 64 });
  }

  get parser() {
    return Parsers.MULTI_LINE_SPLIT;
  }

  roll(terrain, direction) {
    const emptyTerrain = JSON.parse(JSON.stringify(terrain).replace(/O/g, '.'));
    const roundRocks = terrain
      .flatMap((row, y) => row.map((c, x) => (c === 'O' ? new Vector(x, y) : undefined)))
      .filter(Boolean)
      .sort((a, b) => (b.x - a.x) * direction.x + (b.y - a.y) * direction.y);
    roundRocks.forEach((r) => {
      let next = r;
      while (emptyTerrain[next.y + direction.y] && emptyTerrain[next.y + direction.y][next.x + direction.x] === '.')
        next = next.add(direction);
      emptyTerrain[next.y][next.x] = 'O';
    });
    return emptyTerrain;
  }

  spinCycle(terrain) {
    return NWSE.reduce((map, direction) => this.roll(map, direction), terrain);
  }

  scoreMap(map) {
    return map.map((row, ix) => row.filter((r) => r === 'O').length * (map.length - ix)).reduce((a, b) => a + b);
  }

  part1(map) {
    return this.scoreMap(this.roll(map, new Vector(0, -1)));
  }

  part2(map) {
    let newMap = map;
    let i = 1;
    const seen = {};
    while (true) {
      newMap = this.spinCycle(newMap);
      const j = JSON.stringify(newMap);
      if (j in seen) {
        const it = seen[j];
        const max = Object.values(seen).reduce((a, b) => Math.max(a, b));
        const loop = max + 1 - it;
        const equivalent = (1000000000 - seen[j]) % loop;
        const finalMap = Object.keys(seen).find((s) => seen[s] === it + equivalent);
        return this.scoreMap(JSON.parse(finalMap));
      }
      seen[j] = i;
      i += 1;
    }
  }
}
