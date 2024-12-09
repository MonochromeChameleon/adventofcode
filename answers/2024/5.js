import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 5, 5452, 4598);

    this.exampleInput({ part1: 143, part2: 123 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      rules: Parsers.MULTI_LINE_DELIMITED_NUMBERS.withMappedProps({ split: 'ruleSplit' }),
      updates: Parsers.MULTI_LINE_DELIMITED_NUMBERS.withMappedProps({ split: 'updateSplit' }),
    }
  }

  parserGroup(line) {
    return /\|/.test(line) ? 'rules' : 'updates';
  }

  get ruleSplit() {
    return '|';
  }

  get updateSplit() {
    return ',';
  }

  validateUpdate(update, rules) {
    return rules
      .filter(([before, after]) => update.includes(before) && update.includes(after))
      .every(([before, after]) => update.indexOf(after) > update.indexOf(before));
  }

  applyRules(update, rules) {
    const wrongRule = rules.find(([before, after]) => update.indexOf(after) < update.indexOf(before));
    if (!wrongRule) return update;

    const [bix, aix] = wrongRule.map((p) => update.indexOf(p));

    const updated = [...update.slice(0, aix), ...update.slice(aix + 1, bix), ...wrongRule, ...update.slice(bix + 1)];
    return this.applyRules(updated, rules);
  }

  resolveUpdate(update, rules) {
    const rulesToApply = rules.filter(([before, after]) => update.includes(before) && update.includes(after));
    return this.applyRules(update, rulesToApply);
  }

  part1({ rules, updates }) {
    return updates.filter((update) => this.validateUpdate(update, rules))
      .map((update) => update[Math.floor(update.length / 2)])
      .reduce((a, b) => a + b, 0);
  }

  part2({ rules, updates }) {
    return updates.filter((update) => !this.validateUpdate(update, rules))
      .map((update) => this.resolveUpdate(update, rules))
      .map((update) => update[Math.floor(update.length / 2)])
      .reduce((a, b) => a + b, 0);
  }
}
