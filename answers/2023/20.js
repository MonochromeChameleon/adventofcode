import { QuestionBase } from '../../utils/question-base.js';
import { lcm } from '../../utils/number-utils.js';

class Module {
  constructor({ label, type, targets, moduleDefs }) {
    this.label = label;
    this.type = type;
    this.targets = targets;
    this.inputs = Object.fromEntries(moduleDefs.filter((m) => m.targets.includes(label)).map((m) => m.label).map((i) => [i, 'low']));
    this.state = false;
  }

  receive(tone, source, thing) {
    if (this.type === '%' && tone === 'high') return;
    if (this.type === '%') this.state = !this.state;
    if (this.type === '&') {
      this.inputs[source] = tone;
      this.state = Object.values(this.inputs).some((v) => v === 'low');
    }

    thing.enqueue(this.targets, this.state ? 'high' : 'low', this.label);
  }
}

class Thing {
  constructor(modules) {
    const { roadcaster: { targets }, ...rest } = Object.fromEntries(modules.map((md) => [md.label, md]))
    this.targets = targets;
    this.modules = rest;
    this.queue = [];
    this.presses = 0;
    this.sent = { low: 0, high: 0 };

    const toRx = modules.filter(({ targets }) => targets.includes('rx')).map(({ label }) => label);
    const feeders = modules.filter(({ targets }) => targets.some((t) => toRx.includes(t)));
    this.cycles = Object.fromEntries(feeders.map(({ label }) => [label, 0]));
  }

  enqueue(targets, tone, from) {
    this.queue.push(...targets.map((target) => ({ from, tone, target })));
  }

  button() {
    this.presses += 1;
    this.sent.low += 1;
    this.enqueue(this.targets, 'low', 'broadcaster');
    while (this.queue.length) {
      const { target, tone, from } = this.queue.shift();
      if (from in this.cycles && tone === 'high' && !this.cycles[from]) this.cycles[from] = this.presses;
      this.sent[tone] += 1;
      this.modules[target]?.receive(tone, from, this);
    }
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2023, 20, 867118762, 217317393039529);

    this.exampleInput({ part1: 32000000 });
    this.exampleInput({ part1: 11687500 });
  }

  parseLine(line) {
    const [label, ...targets] = line.split('->').flatMap((it) => it.split(',')).map((it) => it.trim());
    return { label: label.substring(1), type: label[0], targets };
  }

  parseInput(lines) {
    const moduleDefs = lines.map(this.parseLine);
    const modules = moduleDefs.map((md) => new Module({ ...md, moduleDefs }));
    return new Thing(modules);
  }

  part1(thing) {
    while (thing.presses < 1000) thing.button();
    return thing.sent.low * thing.sent.high;
  }

  part2(thing) {
    while (Object.values(thing.cycles).some((v) => !v)) thing.button();
    return Object.values(thing.cycles).reduce(lcm);
  }
}
