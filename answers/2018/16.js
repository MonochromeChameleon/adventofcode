import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2018, 16, 677, 540);

    this.operations = [
      'addr',
      'addi',
      'mulr',
      'muli',
      'banr',
      'bani',
      'borr',
      'bori',
      'setr',
      'seti',
      'gtir',
      'gtri',
      'gtrr',
      'eqir',
      'eqri',
      'eqrr',
    ];
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
        .map((value) => Number(value))
    );
    return { before, operation, after };
  }

  addr(a, b, c) {
    this[c] = this[a] + this[b];
  }

  addi(a, b, c) {
    this[c] = this[a] + b;
  }

  mulr(a, b, c) {
    this[c] = this[a] * this[b];
  }

  muli(a, b, c) {
    this[c] = this[a] * b;
  }

  banr(a, b, c) {
    this[c] = this[a] & this[b];
  }

  bani(a, b, c) {
    this[c] = this[a] & b;
  }

  borr(a, b, c) {
    this[c] = this[a] | this[b];
  }

  bori(a, b, c) {
    this[c] = this[a] | b;
  }

  setr(a, b, c) {
    this[c] = this[a];
  }

  seti(a, b, c) {
    this[c] = a;
  }

  gtir(a, b, c) {
    this[c] = a > this[b] ? 1 : 0;
  }

  gtri(a, b, c) {
    this[c] = this[a] > b ? 1 : 0;
  }

  gtrr(a, b, c) {
    this[c] = this[a] > this[b] ? 1 : 0;
  }

  eqir(a, b, c) {
    this[c] = a === this[b] ? 1 : 0;
  }

  eqri(a, b, c) {
    this[c] = this[a] === b ? 1 : 0;
  }

  eqrr(a, b, c) {
    this[c] = this[a] === this[b] ? 1 : 0;
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
      this.operations
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
      {}
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
