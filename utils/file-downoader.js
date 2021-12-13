import axios from 'axios';
import * as https from 'https';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

export async function download(day) {
  const cookie = await readFile(resolve('./cookie.txt'), 'utf8');
  const url = `https://adventofcode.com/2021/day/${day}/input`;

  const response = await axios.get(url, {
    headers: {
      Cookie: cookie.trim(),
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  await writeFile(resolve(`./inputs/${day}.txt`), response.data, { flag: 'wx' }).catch(() => {});
}
