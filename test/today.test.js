/* eslint-disable import/no-dynamic-require, global-require */
/* eslint-env node, mocha */

import { expect } from 'chai';
import { loadQuestion } from '../framework/load-question.js';

const month = new Date().getMonth();
const year = new Date().getFullYear() + ~~(month / 11) - 1;
const day = month === 11 ? new Date().getDate() : 25;

const Question = await loadQuestion(year, day);

describe(`Day ${day}`, () => {
  const questions = [new Question({ useTestData: true }), new Question()];

  [1, 2].forEach((part) => {
    describe(`Part ${part}`, () =>
      ['Test', 'Actual'].forEach((desc, ix) => {
        const q = questions[ix];
        const expected = q.expectedResult(part);
        it(`${desc} result should be ${expected}`, async () => {
          const result = await q.run(part);
          expect(result).to.equal(q.expectedResult(part));
        }).timeout(100000);
      }));
  });
});
