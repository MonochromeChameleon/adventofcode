import { QuestionBase } from '../../utils/question-base.js';
import { maxBy } from '../../utils/array-utils.js';

class Guard {
  constructor(id) {
    this.id = id;
    this.minutes = new Array(60).fill(0);
  }

  sleep(asleep, awake) {
    const from = asleep.minute;
    const to = awake.minute;

    Array.from({ length: to - from }).forEach((_, m) => {
      this.minutes[m + from] += 1;
    });
  }

  get total() {
    return this.minutes.reduce((a, b) => a + b);
  }

  get sleepiness() {
    return this.minutes.reduce((a, b) => Math.max(a, b));
  }

  get sleepiestMinute() {
    return this.minutes.indexOf(this.sleepiness);
  }

  get sleepyId() {
    return this.sleepiestMinute * this.id;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2018, 4, 118599, 33949);

    this.exampleInput({ part1: 240, part2: 4455 });
  }

  parseLine(line) {
    const [, date, time, what] = line.match(/\[(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2})] (.*)/);
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    const [, id] = (what.match(/Guard #(\d+) begins shift/) || []).map(Number);
    const asleep = /falls asleep/.test(what);

    return {
      id,
      year,
      month,
      day,
      hour,
      minute,
      asleep,
    };
  }

  postParse(input) {
    const sorted = input.sort(
      (a, b) => a.year - b.year || a.month - b.month || a.day - b.day || a.hour - b.hour || a.minute - b.minute,
    );
    const guards = {};

    for (let i = 0; i < input.length; i += 1) {
      const { id } = sorted[i];
      guards[id] = guards[id] || new Guard(id);
      while (sorted[i + 1] && !sorted[i + 1].id) {
        guards[id].sleep(sorted[i + 1], sorted[i + 2]);
        i += 2;
      }
    }

    return Object.values(guards);
  }

  part1(guards) {
    const { sleepyId } = maxBy(guards, 'total');
    return sleepyId;
  }

  part2(guards) {
    const { sleepyId } = maxBy(guards, 'sleepiness');
    return sleepyId;
  }
}
