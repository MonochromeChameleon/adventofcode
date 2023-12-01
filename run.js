import { run } from './adventofcode.js';

let [year, day, part] = process.argv.filter((it) => Number(it)).map(Number);

if (!year || year < 2015) {
  const month = new Date().getMonth();
  part = day;
  day = year;
  year = new Date().getFullYear() + ~~(month / 11) - 1;
}

if (!day) {
  day = new Date().getDate();
}

if (!part && (day === 1 || day === 2)) {
  part = day;
  day = new Date().getDate();
}

// eslint-disable-next-line no-unused-vars
const hasFlag = (flagName, shortFlag = flagName[0]) =>
  process.argv.includes(`--${flagName}`) ||
  !!process.argv.filter((it) => /^-\w/.test(it)).find((it) => it.includes(shortFlag));

run({ year, day, part });
