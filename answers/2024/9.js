import { Parsers, QuestionBase } from '../../utils/question-base.js';
import { triangle } from '../../utils/triangle-utils.js';
import { groupBy } from '../../utils/count-by-value.js';

export class Question extends QuestionBase {
  constructor() {
    super(2024, 9, 6607511583593, 6636608781232);

    this.exampleInput({ part1: 1928, part2: 2858 });
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  get mutates() {
    return true;
  }

  postParse(input) {
    const disk = input.reduce(({ start, chunks }, v, ix) => ({
      start: start + v,
      chunks: [
        ...chunks,
        {
          type: ix % 2 ? 'gaps' : 'files',
          fileId: ix / 2,
          start,
          size: v,
          checksum: ix % 2 ? 0 : ix * ((start * v) + triangle(v - 1)) / 2
        }
      ]
    }), { start: 0, chunks: [] });

    return { input, ...groupBy(disk.chunks, ({ type }) => type) };
  }

  fillTheThing(count, input, offset) {
    if (input.every((i) => i === 0)) return { out: [], input };

    const [f, g, ...tupni] = input.toReversed();
    if (f >= count) {
      return {
        out: Array.from({ length: count }, () => Math.floor((input.length + offset) / 2)),
        input: [...tupni.toReversed(), g, f - count]
      };
    }

    const { out: o, ...rest } = this.fillTheThing(count - f, tupni.toReversed(), offset);

    return {
      out: [...Array.from({ length: f }, () => Math.floor((input.length + offset) / 2)), ...o],
      ...rest
    };
  }

  takeWhile(arr, cond) {
    for (let i = 0; i < arr.length; i++) {
      if (!cond(arr.slice(0, i))) return arr.slice(0, i);
    }
    return arr;
  }

  part1({ input: raw, files, gaps }) {
    // files.reverse().forEach((f) => {
    //   const gs = this.takeWhile(gaps, (g) => g.reduce((t, { size: s }) => t + s, 0) < f.size);
    //   gs.forEach((g) => g.checksum = f.fileId * ((g.start * g.size) + triangle(g.size - 1)) / 2)
    // });
    //
    // return files.reduce((t, { checksum }) => t + checksum, 0);

    const result = raw.reduce(({ outdex, total, input, offset }, v, ix) => {
      if (ix % 2 === 0) {
        const value = ix / 2;
        const [size = 0, ...output] = input;
        return {
          total: total + (value * ((outdex * size) + triangle(size - 1))),
          outdex: outdex + size,
          input: output
        };
      }

      const { out: o, input: i } = this.fillTheThing(v, input, ix);

      return {
        total: o.reduce((t, v, ix) => t + (v * (ix + outdex)), total),
        outdex: outdex + v,
        input: i.slice(1)
      };
    }, { outdex: 0, total: 0, input: raw, offset: 0 });

    return result.total;
  }

  part2({ files, gaps }) {
    files.reverse().forEach((f) => {
      const gap = gaps.find(({ start, size }) => start < f.start && size >= f.size);
      if (gap) {
        f.checksum = f.fileId * ((gap.start * f.size) + triangle(f.size - 1));
        gap.start += f.size;
        gap.size -= f.size;
      }
    });

    return files.reduce((t, { checksum }) => t + checksum, 0);
  }
}
