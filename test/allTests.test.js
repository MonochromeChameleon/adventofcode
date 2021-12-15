/* eslint-disable import/no-dynamic-require, global-require */
/* eslint-env node, mocha */

import { expect } from 'chai';
import { loadQuestion } from '../utils/load-question.js';

const days = Array.from({ length: new Date().getDate() }).map((r, ix) => ix + 1);
const questions = await Promise.all(days.map((day) => loadQuestion(day)));

questions.forEach((Question, dix) =>
  describe(`Day ${dix + 1}`, () => {
    if (Question.skip) {
      return;
    }

    const questions = [new Question({ useTestData: true }), new Question()];

    [1, 2].forEach((part) => {
      describe(`Part ${part}`, () =>
        ['Test', 'Actual'].forEach((desc, ix) => {
          const q = questions[ix];
          const expected = q.expectedResult(part);
          it(`${desc} result should be ${expected}`, async () => {
            const result = await q.run(part);
            expect(result).to.equal(q.expectedResult(part));
          }).timeout(10000);
        }));
    });
  })
);
