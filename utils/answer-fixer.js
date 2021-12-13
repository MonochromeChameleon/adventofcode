import { loadQuestion } from './load-question.js';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

const day = new Date().getDate();
const Question = await loadQuestion(day);

const questions = [new Question({ useTestData: true }), new Question()];
const answers = await Promise.all([1, 2].flatMap((part) => questions.map(q => q.run(part))));
const moduleFile = resolve(`./days/${day}.js`);
const lines = await readFile(moduleFile, 'utf8').then(data => data.split('\n'));
const superLine = lines.findIndex((line) => line.startsWith(`    super(${day},`));
lines[superLine] = `    super(${day}, ${answers.join(', ')}, args);`;
await writeFile(moduleFile, lines.join('\n'));
