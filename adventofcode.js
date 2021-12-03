import { resolve } from 'path';
import { readFile, copyFile } from 'fs/promises';

async function loadModule(day) {
  const moduleFile = resolve(`./days/day${day}.js`);
  try {
    return await import(moduleFile);
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      await copyFile(resolve('./days/template.js'), moduleFile);
    }
  }
}

function readInput(day) {
  const filePath = resolve(`./inputs/${day}.txt`);
  return readFile(filePath, 'utf8');
}

async function loadInputFile({ day, parseFile, useTestData, testData }) {
  const raw = useTestData ? testData : await readInput(day);
  const lines = raw.split('\n').filter(it => it);
  return parseFile(lines);
}

const expectedResult = ({ part, useTestData, results: { [useTestData ? 'test' : 'actual']: { [`part${part}`]: result } } }) => result;

async function runPart({ day, part, file, validate, ...rest }) {
  const execute = ({ [`part${part}`]: func }) => func(file);
  const result = await execute({ ...rest });

  if (validate) {
    if (result !== expectedResult({ part, ...rest })) {
      console.log(`ERROR executing day ${day}, part: ${part}: expected ${expectedResult({ part, ...rest })}, got ${result}`);
      process.exit(0);
    }
  } else if (!validate){
    console.log(`Executing day ${day}, part ${part}`);
    console.log(result);
  }
}

async function runDay({ day, part, ...rest }) {
  const module = await loadModule(day);

  if (!module || module.skip) {
    console.log(`Day ${day} not implemented yet`);
    return;
  }

  const file = await loadInputFile({ day, ...module, ...rest });

  if (part !== 2) await runPart({ day, part: 1, file, ...module, ...rest });
  if (part !== 1) await runPart({ day, part: 2, file, ...module, ...rest });
}

export async function run({ day, validate, ...rest }) {
  if (day) {
    await runDay({ day, validate, ...rest });
  } else {
    const maxDay = new Date().getDate();
    for (let i = 1; i <= maxDay; i++) {
      await runDay({ day: i, validate, ...rest });
    }
  }

  if (validate) {
    console.log("Everything works!");
  }
}
