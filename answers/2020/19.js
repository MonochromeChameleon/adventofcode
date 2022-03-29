import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Rule {
  constructor(id, rule) {
    this.id = id;
    this.rule = rule.replace(/"/g, '');
    this.rules = rule.split(' | ').map((r) => r.split(' ').map((v) => Number(v)));
  }

  apply(inputs, ruleLookup) {
    if (/[ab]/.test(this.rule)) return this.applyLetterMatch(inputs);
    return this.applyRules(inputs, ruleLookup);
  }

  applyLetterMatch(inputs) {
    const matching = inputs.filter((inp) => inp[0] === this.rule);
    const rest = matching.map((inp) => inp.slice(1)).filter(Boolean);
    const pass = !!matching.length;
    return { pass, rest };
  }

  applyRules(inputs, ruleLookup) {
    const options = this.rules.map((ruleIds) => ruleIds.map((id) => ruleLookup[id]));

    const results = options.flatMap((rules) =>
      inputs
        .map((input) =>
          rules.reduce(
            ({ pass, rest }, rule) => {
              if (!pass || !rest.length) return { pass: false, rest: [] };
              return rule.apply(rest, ruleLookup);
            },
            {
              pass: true,
              rest: [input],
            }
          )
        )
        .filter(({ pass }) => pass)
    );

    if (results.some((r) => !r.rest.length)) return { pass: true, rest: [] };
    return { pass: !!results.length, rest: [...new Set(results.flatMap((r) => r.rest))] };
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2020, 19, 208, 316);

    this.exampleInput({ part1: 2 });
    this.exampleInput({ part1: 3, part2: 12 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      rules: Parsers.PROPERTY_LIST,
      input: Parsers.PARSER,
    };
  }

  parseValue(value, key) {
    return new Rule(key, value);
  }

  parserGroup(line) {
    return /:/.test(line) ? 'rules' : 'input';
  }

  countPassing({ rules, input }) {
    return input.filter((i) => {
      const { pass, rest } = rules[0].apply([i], rules);
      return pass && rest.length === 0;
    }).length;
  }

  part1({ rules, input }) {
    return this.countPassing({ rules, input });
  }

  part2({ rules, input }) {
    rules[8] = new Rule(8, '42 | 42 8');
    rules[11] = new Rule(11, '42 31 | 42 11 31');

    return this.countPassing({ rules, input });
  }
}
