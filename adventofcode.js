/* eslint-disable no-console */
import { loadQuestion } from './utils/load-question.js';

async function runPart(q, part) {
  console.log(`Executing day ${q.day}, part ${part}`);
  const result = await q.run(part);
  console.log(result);
}

async function runDay({ year, day, part, ...rest }) {
  const Question = await loadQuestion(year, day);

  if (!Question || Question.skip) {
    return;
  }

  const q = new Question(rest);

  if (part !== 2) await runPart(q, 1);
  if (part !== 1) await runPart(q, 2);
}

export async function run({ day, ...rest }) {
  if (day) {
    await runDay({ day, ...rest });
  } else {
    const month = new Date().getMonth();
    const maxDay = month === 11 ? new Date().getDate() : 25;
    await Array.from({ length: maxDay }).reduce(
      (p, _, ix) => p.then(() => runDay({ day: ix + 1, ...rest })),
      Promise.resolve()
    );
  }
}
