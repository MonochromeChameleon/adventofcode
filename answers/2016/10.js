import { QuestionBase, Parsers } from '../../utils/question-base.js';

class Robot {
  constructor(id) {
    this.id = id;
    this.sources = [];
  }

  addSource(source) {
    this.sources.push(source);
  }

  value(source, robots) {
    if (Number.isInteger(source)) return source;
    const { bot, hilo } = source;
    return robots.bots[bot][hilo](robots);
  }

  values(robots) {
    if (!this._values) {
      this._values = this.sources.map((source) => this.value(source, robots)).sort((a, b) => a - b);
    }
    return this._values;
  }

  low(robots) {
    if (this._low === undefined) {
      this._low = this.values(robots)[0];
    }
    return this._low;
  }

  high(robots) {
    if (this._high === undefined) {
      this._high = this.values(robots)[1];
    }
    return this._high;
  }
}

class Output {
  constructor(id, source) {
    this.id = id;
    this.source = source;
  }

  getValue(robots) {
    if (this._value === undefined) {
      const { bot, hilo } = this.source;
      this._value = robots.bots[bot][hilo](robots);
    }
    return this._value;
  }
}

class Robots {
  constructor() {
    this.outputs = {};
    this.bots = {};
  }

  setValue(bot, value) {
    const r = this.bots[bot] || new Robot(bot);
    r.addSource(value);
    this.bots[bot] = r;
  }

  setOutput(bot, hilo, outId) {
    this.outputs[outId] = new Output(outId, { bot, hilo });
  }

  addLine(line) {
    if (line.startsWith('value')) {
      const [value, bot] = line
        .match(/^value (\d+) goes to bot (\d+)$/)
        .slice(1)
        .map(Number);
      this.setValue(bot, value);
    } else {
      const [, bot, lout, loutId, hout, houtId] = line.match(
        /^bot (\d+) gives low to (\w+) (\d+) and high to (\w+) (\d+)$/,
      );
      if (lout === 'output') {
        this.setOutput(bot, 'low', Number(loutId));
      } else {
        this.setValue(Number(loutId), { bot, hilo: 'low' });
      }
      if (hout === 'output') {
        this.setOutput(bot, 'high', Number(houtId));
      } else {
        this.setValue(Number(houtId), { bot, hilo: 'high' });
      }
    }
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2016, 10, 47, 2666);
  }

  get parser() {
    return Parsers.REDUCE;
  }

  get reducer() {
    return Robots;
  }

  part1(robots) {
    return Object.values(robots.bots).find((it) => it.low(robots) === 17 && it.high(robots) === 61).id;
  }

  part2(robots) {
    return [0, 1, 2].map((ix) => robots.outputs[ix].getValue(robots)).reduce((a, b) => a * b);
  }
}
