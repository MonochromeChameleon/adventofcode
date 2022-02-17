import { QuestionBase } from '../../utils/question-base.js';

class Disc {
  constructor({ name, size, position }) {
    this.name = name;
    this.size = size;
    this.position = position;
  }

  steps(time) {
    return (this.size - ((this.position + this.name + time) % this.size)) % this.size;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2016, 15, 121834, 3208099);

    this.exampleInput({ part1: 5 });
  }

  parseLine(line) {
    const [, ...params] = line.match(/^Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+).$/);
    const [name, size, position] = params.map(Number);
    return new Disc({ name, size, position });
  }

  getIncrement(discs, time) {
    return discs.map((d) => d.steps(time)).reduce((a, b) => Math.max(a, b));
  }

  findTime(...discs) {
    let i = 0;
    let finished = false;

    while (!finished) {
      const increment = this.getIncrement(discs, i);
      finished = !increment;
      i += increment;
    }
    return i;
  }

  part1(discs) {
    return this.findTime(...discs);
  }

  part2(discs) {
    const extra = new Disc({ name: discs.length + 1, size: 11, position: 0 });
    return this.findTime(...discs, extra);
  }
}
