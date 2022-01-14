import { loadQuestion } from '../utils/load-question.js';
import { expect } from 'chai';

const month = new Date().getMonth();
const year = new Date().getFullYear() + ~~(month / 11) - 1;
const day = month === 11 ? new Date().getDate() : 25;

const getDays = (y) => {
  const d = y === year ? day : 25;
  return Array.from({ length: d }).map((r, ix) => ix + 1);
}

export default async function runAllTests({ years }) {
  const allQuestions = await Promise.all(years.map((y) => Promise.all(getDays(y).map((day) => loadQuestion(y, day)))));

  allQuestions.forEach((questions, yix) =>
    describe(`${years[yix]}`, () =>
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
              const partid = `part${part}`;

              q.examples.filter(({ [partid]: ans }) => ans !== undefined).forEach(({ input, [partid]: ans }, ix) => {
                it(`Example ${ix + 1} should be ${ans}`, async () => {
                  const result = await q[partid](input);
                  expect(result).to.equal(ans);
                }).timeout(10000);
              });

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
}
