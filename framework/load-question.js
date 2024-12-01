import { resolve } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { template } from './template.js';
import { download, downloadExamples } from './file-downoader.js';

async function getInputs(year, day) {
  await mkdir(`./inputs/${year}`, { recursive: true });
  await download(year, day).catch((e) => {
     
    console.error(e);
  });
  return downloadExamples(year, day).catch((e) => {
     
    console.error(e);
  });
}

export async function loadQuestion(year, day) {
  const moduleFile = resolve(`./answers/${year}/${day}.js`);
  try {
    const { Question } = await import(moduleFile);
    return Question;
  } catch (e) {
    console.error(e);
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      await mkdir(`./answers/${year}`, { recursive: true });
      const answers = await getInputs(year, day);
      await writeFile(resolve(`./answers/${year}/${day}.js`), template(year, day, answers), { flag: 'wx' }).catch(
        (err) => {
           
          console.error(err);
        },
      );
    }
  }

  return { skip: true };
}
