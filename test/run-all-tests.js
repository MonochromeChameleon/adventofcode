import { loadQuestion } from '../utils/load-question.js';
import { expect } from 'chai';

const month = new Date().getMonth();
const year = new Date().getFullYear() + ~~(month / 11) - 1;
const day = month === 11 ? new Date().getDate() : 25;

const allYears = Array.from({ length: year - 2014 }).map((r, ix) => ix + 2015);

const getDays = (y) => {
  const d = y === year ? day : 25;
  return Array.from({ length: d }).map((r, ix) => ix + 1);
};

export default async function runAllTests({ years = allYears, wip = false } = {}) {
  const allQuestions = await Promise.all(years.map((y) => Promise.all(getDays(y).map((day) => loadQuestion(y, day)))));

  allQuestions.forEach((questions, yix) =>
    describe(`${years[yix]}`, () => {
      const qs = questions
        .filter(({ skip }) => !skip)
        .map((Question) => new Question())
        .filter((q) => q.expectedResult(1) !== undefined || q.expectedResult(2) !== undefined || !!q.examples.length);
      if (!qs.length) return;

      (wip ? [qs[qs.length - 1]] : qs).forEach((q) => {
        describe(`Day ${q.day}`, () => {
          [1, 2]
            .map((part) => ({
              part,
              expected: q.expectedResult(part),
              examples: q.examples.filter(({ [`part${part}`]: ans }) => ans !== undefined),
            }))
            .filter(({ part, expected, examples }) => {
              if (wip && part === 2 && q.expectedResult(1) !== undefined) return true;
              return [expected, ...examples].filter((it) => it !== undefined).length;
            })
            .forEach(({ part, expected }) =>
              describe(`Part ${part}`, () => {
                const partid = `part${part}`;

                q.examples
                  .filter(({ [partid]: ans }) => ans !== undefined)
                  .forEach(({ input, [partid]: ans, params }, ix) => {
                    it(`Example ${ix + 1} should be ${ans}`, async () => {
                      const result = await q[partid](input, ...params);
                      expect(result).to.equal(ans);
                    }).timeout(10000);
                  });

                if (wip || expected !== undefined) {
                  it(`Result should be ${expected}`, async () => {
                    const result = await q.run(part);
                    expect(result).to.equal(q.expectedResult(part));
                  }).timeout(10000);
                }
              })
            );
        });
      });

      [].forEach((Question, dix) =>
        describe(`Day ${dix + 1}`, () => {
          if (Question.skip) {
            return;
          }

          const q = new Question();

          [1, 2]
            .map((part) => ({
              part,
              expected: q.expectedResult(part),
              examples: q.examples.filter(({ [`part${part}`]: ans }) => ans !== undefined),
            }))
            .filter(({ expected, examples }) => [expected, ...examples].filter((it) => it !== undefined).length)
            .forEach(({ part, expected }) =>
              describe(`Part ${part}`, () => {
                const partid = `part${part}`;

                q.examples
                  .filter(({ [partid]: ans }) => ans !== undefined)
                  .forEach(({ input, [partid]: ans }, ix) => {
                    it(`Example ${ix + 1} should be ${ans}`, async () => {
                      const result = await q[partid](input);
                      expect(result).to.equal(ans);
                    }).timeout(10000);
                  });

                if (expected !== undefined) {
                  it(`Result should be ${expected}`, async () => {
                    const result = await q.run(part);
                    expect(result).to.equal(q.expectedResult(part));
                  }).timeout(10000);
                }
              })
            );
        })
      );
    })
  );
}
