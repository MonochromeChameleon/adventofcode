import { QuestionBase } from '../../utils/question-base.js';
import { alphabet } from '../../utils/alphabet.js';

const ALPHABET = alphabet(26, true);

export class Question extends QuestionBase {
  constructor() {
    super(2018, 7, 'ABDCJLFMNVQWHIRKTEUXOZSYPG', 896);

    this.exampleInput({ part1: 'CABDFE', part2: 15 }, 2, 0);
  }

  parseLine(line) {
    const [, first, second] = /^Step (\w) must be finished before step (\w) can begin.$/.exec(line);
    return { first, second };
  }

  postParse(deps) {
    const steps = [...new Set(deps.flatMap(({ first, second }) => [first, second]))].sort();
    const empty = Object.fromEntries(steps.map((step) => [step, []]));
    return deps.reduce(
      (out, { first, second }) => ({
        ...out,
        [second]: [first, ...out[second]],
      }),
      empty,
    );
  }

  part1(input) {
    return Object.keys(input)
      .reduce((out) => {
        const next = Object.keys(input)
          .filter((step) => !out.includes(step))
          .find((step) => input[step].every((dep) => out.includes(dep)));
        return [...out, next];
      }, [])
      .join('');
  }

  part2(input, parallel = 5, minTime = 60) {
    return {
      items: Object.keys(input),
      get started() {
        return this.items.filter((s) => s in this);
      },
      get completed() {
        return this.started.filter((o) => this[o].end <= this.nextEvent);
      },
      nextEvent: 0,
      resolve() {
        this.items
          .filter((step) => !this.started.includes(step))
          .filter((step) => input[step].every((dep) => this.completed.includes(dep)))
          .slice(0, parallel + this.completed.length - this.started.length)
          .forEach((s) => {
            this[s] = {
              start: this.nextEvent,
              end: this.nextEvent + ALPHABET.indexOf(s) + 1 + minTime,
            };
          });

        this.nextEvent = this.started
          .map((s) => this[s].end)
          .filter((e) => e > this.nextEvent)
          .sort((a, b) => a - b)[0];
        if (this.completed.length < this.items.length) return this.resolve();
        return this.nextEvent;
      },
    }.resolve();
  }
}
