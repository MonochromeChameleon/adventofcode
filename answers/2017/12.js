import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2017, 12, 175, 213);

    this.exampleInput({ part1: 6, part2: 2 });
  }

  parseLine(line) {
    const [id, ...connections] = line
      .replace('<->', ',')
      .split(',')
      .map((x) => Number(x));
    return { id, connections };
  }

  postParse(input) {
    return input.reduce((acc, { id, connections }) => ({ ...acc, [id]: connections }), {});
  }

  allConnections(input, from, sofar = new Set([from])) {
    const connections = input[from].filter((x) => !sofar.has(x));
    return connections.reduce(
      (all, c) => new Set([...all, c, ...this.allConnections(input, c, new Set([c, ...all]))]),
      sofar
    );
  }

  part1(input) {
    return this.allConnections(input, 0).size;
  }

  part2(input) {
    const remaining = new Set(Object.keys(input).map(Number));
    let groups = 0;
    while (remaining.size > 0) {
      this.allConnections(input, remaining.values().next().value).forEach((x) => remaining.delete(x));
      groups += 1;
    }
    return groups;
  }
}
