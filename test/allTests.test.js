/* eslint-disable import/no-dynamic-require, global-require */
/* eslint-env node, mocha */

import { expect } from 'chai';
import { loadQuestion } from '../utils/load-question.js';

const days = Array.from({ length: new Date().getDate() }).map((r, ix) => ix + 1);
const questions = await Promise.all(days.map((day) => loadQuestion(day)));

questions.forEach((Question, dix) =>
  describe(`Day ${dix + 1}`, () =>
    ['test', 'actual'].forEach((desc, ix) => {
      const q = new Question({ useTestData: !ix });

      describe(desc, () =>
        [1, 2].forEach((part) =>
          it(`Part ${part} should be ${q.expectedResult(part)}`, async () => {
            const result = await q.run(part);
            expect(result).to.equal(q.expectedResult(part));
          })
        )
      );
    }))
);
