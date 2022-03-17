import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { Vector } from '../../utils/vector.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 25, 388);

    this.exampleInput({ part1: 2 });
    this.exampleInput({ part1: 4 });
    this.exampleInput({ part1: 3 });
    this.exampleInput({ part1: 8 });
  }

  get parser() {
    return Parsers.DAISY_CHAIN;
  }

  get parsers() {
    return {
      delimitedNumbers: Parsers.MULTI_LINE_DELIMITED_NUMBERS,
      constructor: Parsers.MULTI_LINE_CONSTRUCTOR,
    };
  }

  get split() {
    return ',';
  }

  get inputConstructor() {
    return Vector;
  }

  get spreadParams() {
    return true;
  }

  findConstellation(from, points) {
    const neighbours = points.filter((p) => p.subtract(from).manhattan <= 3);
    if (neighbours.length === 0) return { constellation: [from], rest: points };

    return neighbours.reduce(
      (c, n) => {
        const { constellation, rest } = this.findConstellation(n, c.rest);
        return { constellation: [...c.constellation, ...constellation], rest };
      },
      { constellation: [from], rest: points.filter((p) => !neighbours.includes(p)) }
    );
  }

  part1(input) {
    let unconstellated = input.slice(0);
    const constellations = [];
    while (unconstellated.length) {
      const next = unconstellated.shift();
      const { constellation, rest } = this.findConstellation(next, unconstellated);
      constellations.push(constellation);
      unconstellated = rest;
    }

    return constellations.length;
  }
}
