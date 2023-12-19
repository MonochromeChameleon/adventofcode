import runAllTests from './run-all-tests.js';

const month = new Date().getMonth();
const year = new Date().getFullYear() + ~~(month / 11) - 1;
const hour = new Date().getUTCHours();
const day = Math.min(month === 11 ? new Date().getDate() : 25, 25);

await runAllTests({ years: [year], getQuestionNumbers: () => [hour < 5 ? day - 2 : day - 1] });
