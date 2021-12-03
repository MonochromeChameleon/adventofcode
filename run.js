import { run } from './adventofcode.js';

const [day, part] = process.argv.filter(it => Number(it)).map(Number);

const hasFlag = (flagName, shortFlag = flagName[0]) =>
  process.argv.includes(`--${flagName}`) || !!process.argv.filter(it => /^-\w/.test(it)).find(it => it.includes(shortFlag));

const useTestData = hasFlag('test');
const validate = hasFlag('validate');

run({ day, part, useTestData, validate });
