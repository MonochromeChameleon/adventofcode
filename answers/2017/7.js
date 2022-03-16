import { Parsers, QuestionBase } from '../../utils/question-base.js';

class Program {
  constructor(line) {
    const [, name, weight, children] = line.match(/^(\w+) \((\d+)\)(?: -> (.*))?$/);
    this.name = name;
    this.weight = Number(weight);
    this.children = children ? children.split(', ') : [];
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2017, 7, 'airlri', 1206);

    this.exampleInput({ part1: 'tknk', part2: 60 });
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Program;
  }

  findRoot(programs) {
    const children = programs.flatMap((p) => p.children);
    return programs.find(({ name }) => !children.includes(name));
  }

  findWeight(child, programs) {
    const program = programs.find(({ name }) => name === child);
    return {
      totalWeight: program.children
        .map((c) => this.findWeight(c, programs))
        .reduce((weight, { totalWeight }) => weight + totalWeight, program.weight),
      ...program,
    };
  }

  findWrongWeight(child, programs) {
    const program = programs.find(({ name }) => name === child);
    const [first, ...rest] = program.children.map((c) => ({ child: c, ...this.findWeight(c, programs) }));
    if (rest.every((it) => it.totalWeight === first.totalWeight)) return false;
    const [maybeWrong, other] = rest.filter((it) => it.totalWeight !== first.totalWeight);
    const wrongChild = other ? first : maybeWrong;
    const rightChild = other ? maybeWrong : first;
    return (
      this.findWrongWeight(wrongChild.child, programs) ||
      wrongChild.weight + rightChild.totalWeight - wrongChild.totalWeight
    );
  }

  part1(programs) {
    const root = this.findRoot(programs);
    return root.name;
  }

  part2(programs) {
    return this.findWrongWeight(this.answers.part1, programs);
  }
}
