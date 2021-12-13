import { resolve } from 'path';
import { writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import { template } from './template.js';
import { download } from './file-downoader.js';

export async function loadQuestion(day) {
  const moduleFile = resolve(`./days/${day}.js`);
  try {
    const { Question } = await import(moduleFile);
    if (!existsSync(resolve(`./inputs/${day}.txt`))) {
      await download(day);
    }

    return Question;
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      await writeFile(resolve(`./days/${day}.js`), template(day), { flag: 'wx' }).catch(() => {});
      await writeFile(resolve(`./test/inputs/${day}.txt`), '\n', { flag: 'wx' }).catch(() => {});
      await download(day);
    }
  }

  return { skip: true };
}
