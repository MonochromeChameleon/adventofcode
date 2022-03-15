import { QuestionBase } from '../../../utils/question-base.js';

export class InstructionSet extends QuestionBase {
  constructor(...args) {
    super(...args);

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
}
