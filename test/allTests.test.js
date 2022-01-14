import runAllTests from './run-all-tests.js';

const month = new Date().getMonth();
const year = new Date().getFullYear() + ~~(month / 11) - 1;
const years = Array.from({ length: year - 2014 }).map((r, ix) => ix + 2015);

await runAllTests({ years });
