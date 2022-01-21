import { resolve } from 'path';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { template } from './template.js';
import { download } from './file-downoader.js';

export async function loadQuestion(year, day) {
  const moduleFile = resolve(`./answers/${year}/${day}.js`);
  try {
    const { Question } = await import(moduleFile);
    if (!existsSync(resolve(`./inputs/${year}/${day}.txt`))) {
      await mkdir(`./inputs/${year}`, { recursive: true });
      await download(year, day).catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
      });
    }

    return Question;
  } catch (e) {
    if (e.code === 'ERR_MODULE_NOT_FOUND') {
      await mkdir(`./answers/${year}`, { recursive: true });
      await writeFile(resolve(`./answers/${year}/${day}.js`), template(year, day), { flag: 'wx' }).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
      await mkdir(`./inputs/${year}`, { recursive: true });
      await download(year, day).catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err);
      });
    }
  }

  return { skip: true };
}
