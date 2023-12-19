import { Parsers, QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2023, 19, 418498, 123331556462603);

    this.exampleInput({ part1: 19114, part2: 167409079868000 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      instructions: Parsers.PARSER.withMappedProps({
        parseInput: 'parseInstructions',
        parseLine: 'parseInstruction'
      }),
      parts: Parsers.PARSER.withMappedProps({ parseLine: 'parsePart' })
    };
  }

  parserGroup(line) {
    return line.startsWith('{') ? 'parts' : 'instructions';
  }

  parseInstructions(lines) {
    return Object.fromEntries(lines.map((l) => this.parseInstruction(l)));
  }

  parseInstruction(line) {
    const [label] = line.split('{');
    const conditionStrs = line.substring(line.indexOf('{') + 1, line.length - 1).split(',');
    const conditions = conditionStrs.map((c) => {
      const [cond, res] = c.split(':');
      if (!res) return { res: cond };
      return { prop: cond[0], comp: cond[1], val: Number(cond.substring(2)), res };
    });

    return [label, conditions];
  }

  parsePart(line) {
    return JSON.parse(line.replace(/[xmas]/g, (xmas) => `"${xmas}"`).replace(/=/g, ':'));
  }

  runCommand(part, instructions) {
    for (const { prop, comp, val, res } of instructions) {
      if (!prop) return res;
      const value = part[prop];
      if (comp === '>' && value > val) return res;
      if (comp === '<' && value < val) return res;
    }
  }

  isAccepted(part, instructions, command) {
    let evaluated = command;
    while (evaluated !== 'R' && evaluated !== 'A') evaluated = this.runCommand(part, instructions[evaluated]);
    return evaluated === 'A';
  }

  part1({ instructions, parts }) {
    return parts.filter((p) => this.isAccepted(p, instructions, 'in')).map(({ x, m, a, s }) => x + m + a + s).reduce((a, b) => a + b);
  }

  reprocess(xmas, instructions) {
    return instructions.reduce((out, { prop, comp, val, res }) => {
      const toEval = out.pop();
      if (!prop) return [...out, { cmd: res, ...toEval }];
      const { cmd, [prop]: { min, max }, ...rest } = toEval;
      const a = { cmd: res, [prop]: { min: comp === '>' ? val + 1 : min, max: comp === '>' ? max : val - 1 }, ...rest };
      const b = { [prop]: { min: comp === '>' ? min : val, max: comp === '>' ? val : max }, ...rest };
      return [...out, ...[a, b].filter(({ [prop]: { min: mn, max: mx } }) => mn <= mx)];
    }, [xmas]);
  }

  part2({ instructions }) {
    const start = Object.fromEntries(['x', 'm', 'a', 's'].map((c) => [c, { min: 1, max: 4000 }]));
    const state = [{ cmd: 'in', ...start }];
    while (state.some(({ cmd }) => cmd !== 'A' && cmd !== 'R')) {
      let next = state.shift();
      while (next.cmd === 'R' || next.cmd === 'A') {
        state.push(next);
        next = state.shift();
      }
      state.push(...this.reprocess(next, instructions[next.cmd]));
    }

    return state.filter(({ cmd }) => cmd === 'A')
      .map(({ x, m, a, s }) => [x, m, a, s]
        .map(({ min, max }) => max + 1 - min)
        .reduce((a, b) => a * b))
      .reduce((a, b) => a + b);
  }
}
