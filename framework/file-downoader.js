import axios from 'axios';
import * as https from 'https';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';
import { alphabet } from '../utils/alphabet.js';

const LETTERS = alphabet(26);

export async function download(year, day) {
  const cookie = await readFile(resolve('./cookie.txt'), 'utf8');
  const url = `https://adventofcode.com/${year}/day/${day}/input`;

  const response = await axios.get(url, {
    headers: {
      Cookie: cookie.trim(),
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  await writeFile(resolve(`./inputs/${year}/${day}.txt`), String(response.data), { flag: 'wx' });
}

export async function downloadExamples(year, day) {
  const cookie = await readFile(resolve('./cookie.txt'), 'utf8');
  const url = `https://adventofcode.com/${year}/day/${day}`;

  const response = await axios.get(url, {
    headers: {
      Cookie: cookie.trim(),
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  const html = String(response.data);
  const [, ...examples] = html.split(/<pre>\s*<code>/);
  await Promise.all(
    examples
      .map((ex) => ex.split('</code>'))
      .map(([ex], ix) => writeFile(resolve(`./inputs/${year}/${day}${LETTERS[ix]}.txt`), ex, { flag: 'wx' })),
  );
  const [, ...answers] = html.split(/<code>\s*<em>/);
  return answers.map((ex) => ex.split('</em>')[0]);
}
