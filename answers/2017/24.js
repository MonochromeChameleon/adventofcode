import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 24, 1695, 1673);

    this.exampleInput({ part1: 31, part2: 19 });
  }

  parseLine(line, id) {
    const [a, b] = line.split('/').map(Number);
    return { id, a, b, score: a + b };
  }

  buildBridges({ connector, score, length }, parts) {
    const nextParts = parts.filter(({ a, b }) => a === connector || b === connector);
    if (nextParts.length === 0) return [{ connector, score, length }];
    return nextParts.flatMap((part) =>
      this.buildBridges(
        {
          connector: part.score - connector,
          score: score + part.score,
          length: length + 1,
        },
        parts.filter(({ id }) => id !== part.id),
      ),
    );
  }

  getBridges(input) {
    if (!this._bridges) {
      const starts = input
        .filter(({ a, b }) => !a || !b)
        .map((start) => ({ id: start.id, length: 1, connector: start.a || start.b, score: start.score }));
      this._bridges = starts.flatMap((start) =>
        this.buildBridges(
          start,
          input.filter(({ id }) => id !== start.id),
        ),
      );
    }
    return this._bridges;
  }

  part1(input) {
    const bridges = this.getBridges(input);
    return bridges.reduce((max, bridge) => Math.max(max, bridge.score), 0);
  }

  part2(input) {
    const bridges = this.getBridges(input);
    const maxLength = bridges.reduce((max, bridge) => Math.max(max, bridge.length), 0);
    return bridges.filter(({ length }) => length === maxLength).reduce((max, bridge) => Math.max(max, bridge.score), 0);
  }
}
