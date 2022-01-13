/* eslint-disable import/no-dynamic-require, global-require */
/* eslint-env node, mocha */

import { expect } from 'chai';
import { loadQuestion } from '../utils/load-question.js';

const month = new Date().getMonth();
const year = new Date().getFullYear() + ~~(month / 11) - 1;
const day = month === 11 ? new Date().getDate() : 25;

const years = Array.from({ length: year - 2014 }).map((r, ix) => ix + 2015);
const days = Array.from({ length: day }).map((r, ix) => ix + 1);

const allQuestions = await Promise.all(years.map((year) => Promise.all(days.map((day) => loadQuestion(year, day)))));

allQuestions.forEach((questions, yix) =>
  describe(`${yix + 2015}`, () =>
    questions.forEach((Question, dix) =>
      describe(`Day ${dix + 1}`, () => {
        if (Question.skip) {
          return;
        }

        const q = new Question();

        [1, 2].map((part) => ({
          part,
          expected: q.expectedResult(part),
        })).filter(({ expected }) => expected !== undefined).forEach(({ part, expected }) =>
          describe(`Part ${part}`, () => {
            it(`Result should be ${expected}`, async () => {
              const result = await q.run(part);
              expect(result).to.equal(q.expectedResult(part));
            }).timeout(10000);
          }),
        );
      }),
    ),
  ),
);
