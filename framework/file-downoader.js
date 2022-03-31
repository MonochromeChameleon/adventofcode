import axios from 'axios';
import * as https from 'https';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

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
