import { QuestionBase, Parsers } from '../../utils/question-base.js';

const REQUIRED_FIELDS = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid', 'cid'];

export class Question extends QuestionBase {
  constructor() {
    super(2020, 4, 247, 145);

    this.exampleInput({ part1: 2 });
  }

  get parser() {
    return Parsers.GROUP;
  }

  get groupDelimiter() {
    return /^$/;
  }

  get retainEmptyLines() {
    return true;
  }

  parseGroup(lines) {
    return Object.fromEntries(lines.flatMap((line) => line.split(' ')).map((prop) => prop.split(':')));
  }

  hasAllFields(obj, fields) {
    return fields.every((f) => f in obj);
  }

  validate(field, value) {
    const val = Number(value);
    switch (field) {
      case 'byr':
        return val >= 1920 && val <= 2002;
      case 'iyr':
        return val >= 2010 && val <= 2020;
      case 'eyr':
        return val >= 2020 && val <= 2030;
      case 'hgt':
        const num = Number(value.slice(0, -2)); // eslint-disable-line no-case-declarations
        switch (value.slice(-2)) {
          case 'cm':
            return num >= 150 && num <= 193;
          case 'in':
            return num >= 59 && num <= 76;
          default:
            return false;
        }
      case 'hcl':
        return /^#[0-9a-f]{6}$/.test(value);
      case 'ecl':
        return ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value);
      case 'pid':
        return /^[0-9]{9}$/.test(value);
    }
  }

  isValid(passport, fields) {
    return fields.every((f) => f in passport && this.validate(f, passport[f]));
  }

  part1(input) {
    const fields = REQUIRED_FIELDS.filter((it) => it !== 'cid');
    return input.filter((passport) => this.hasAllFields(passport, fields)).length;
  }

  part2(input) {
    const fields = REQUIRED_FIELDS.filter((it) => it !== 'cid');
    return input.filter((passport) => this.isValid(passport, fields)).length;
  }
}
