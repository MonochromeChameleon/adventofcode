import { QuestionBase, Parsers } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 16, 29878, 855438643439);

    this.exampleInput({ part1: 71 });
    this.exampleInput({ part2: 1 });
  }

  get parser() {
    return Parsers.MULTIPLE;
  }

  get parsers() {
    return {
      rules: Parsers.PROPERTY_LIST.withMappedProps({ split: 'propertySplit' }),
      tickets: Parsers.MULTI_LINE_DELIMITED_NUMBERS,
      ignore: Parsers.PARSER,
    };
  }

  parserGroup(line) {
    if (/:$/.test(line)) return 'ignore';
    if (/:/.test(line)) return 'rules';
    return 'tickets';
  }

  get split() {
    return ',';
  }

  get propertySplit() {
    return ':';
  }

  parseValue(value) {
    return value
      .split('or')
      .map((v) => v.trim())
      .map((v) => v.split('-').map(Number))
      .map(([min, max]) => ({ min, max }));
  }

  isInvalid(value, rules) {
    return Object.values(rules).every((rule) => rule.every(({ min, max }) => value < min || value > max));
  }

  part1({ rules, tickets }) {
    return tickets
      .flat()
      .filter((value) => this.isInvalid(value, rules))
      .reduce((a, b) => a + b);
  }

  part2({ rules, tickets }) {
    const validTickets = tickets.filter((ticket) => ticket.every((value) => !this.isInvalid(value, rules)));

    const fields = tickets[0].map((_, i) => {
      const values = validTickets.map((ticket) => ticket[i]);
      return Object.entries(rules)
        .filter(([, rule]) => values.every((value) => rule.some(({ min, max }) => value >= min && value <= max)))
        .map(([key]) => key);
    });

    while (fields.some((field) => field.length > 1)) {
      const identified = fields.filter((field) => field.length === 1).flat();
      fields.forEach((field, i) => {
        if (field.length > 1) fields[i] = field.filter((value) => !identified.includes(value));
      });
    }

    const mine = Object.fromEntries(tickets[0].map((v, i) => [fields[i][0], v]));
    return Object.keys(rules)
      .filter((rule) => /^departure/.test(rule))
      .map((key) => mine[key])
      .reduce((a, b) => a * b, 1);
  }
}
