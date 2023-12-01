import { Parsers } from '../../utils/question-base.js';
import { InstructionSet } from './instruction-set/instruction-set.js';

export class Question extends InstructionSet {
  constructor() {
    super(2018, 16, 677, 540);
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      topSection: Parsers.GROUP,
      bottomSection: Parsers.MULTI_LINE_DELIMITED_NUMBERS,
    };
  }

  parserGroup(line, ix, lines) {
    if (/\d \d \d \d/.test(line)) {
      return lines[ix - 1].startsWith('Before') ? 'topSection' : 'bottomSection';
    }
    return 'topSection';
  }

  get groupSize() {
    return 3;
  }

  get split() {
    return ' ';
  }

  parseGroup(lines) {
    const [before, operation, after] = lines.map((line) =>
      line
        .replaceAll(/[^\d\s]/g, '')
        .trim()
        .split(' ')
        .map((value) => Number(value)),
    );
    return { before, operation, after };
  }

  countOperations({ before, operation, after }) {
    return this.operations.filter((op) => {
      const b4 = [...before];
      this[op].call(b4, ...operation.slice(1));
      return b4.join(',') === after.join(',');
    }).length;
  }

  identifyOperation(examples) {
    const options = examples.reduce(
      (ops, { before, operation, after }) =>
        ops.filter((op) => {
          const b4 = [...before];
          this[op].call(b4, ...operation.slice(1));
          return b4.join(',') === after.join(',');
        }),
      this.operations,
    );

    if (options.length === 1) {
      return options[0];
    }
    return options;
  }

  streamlineOps(raw) {
    while (Object.values(raw).some((it) => Array.isArray(it))) {
      const identified = Object.values(raw).filter((it) => !Array.isArray(it));
      Object.keys(raw).forEach((key) => {
        if (Array.isArray(raw[key])) {
          const streamlined = raw[key].filter((it) => !identified.includes(it));
          raw[key] = streamlined.length === 1 ? streamlined[0] : streamlined;
        }
      });
    }
    return raw;
  }

  part1({ topSection }) {
    return topSection.filter((ii) => this.countOperations(ii) >= 3).length;
  }

  part2({ topSection, bottomSection }) {
    const opsByOpCode = topSection.reduce((oboc, example) => {
      const [opcode] = example.operation;
      oboc[opcode] = oboc[opcode] || [];
      oboc[opcode].push(example);
      return oboc;
    }, {});

    const rawOps = Object.entries(opsByOpCode).reduce(
      (out, [opcode, examples]) => ({ ...out, [opcode]: this.identifyOperation(examples) }),
      {},
    );
    const ops = this.streamlineOps(rawOps);
    const program = bottomSection.map(([opcode, a, b, c]) => ({
      instruction: ops[opcode],
      params: [a, b, c],
    }));

    this.mixout();
    Parsers.INSTRUCTIONS.mixin(this);
    const finalState = this.execute(program, { 0: 0, 1: 0, 2: 0, 3: 0 });

    return finalState[0];
  }
}
