import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as Parsers from '../parsers/parsers.js';
import { alphabet } from './alphabet.js';

const ALPHABET = alphabet();

export * as Parsers from '../parsers/parsers.js';

export class QuestionBase {
  constructor(year, day, part1, part2) {
    this.year = year;
    this.day = day;
    this.answers = {
      part1,
      part2,
    };

    this.examples = [];
    this.propertyMap = {};

    this.m = new Proxy(this, {
      get: (target, prop) => {
        if (prop in target.propertyMap) {
          return target.m[target.propertyMap[prop]];
        }

        return target[prop];
      },
    });

    this._cache = {};

    this.withCache = new Proxy(this, {
      get: (target, prop) => {
        if (prop in target && typeof target[prop] === 'function') {
          this._cache[prop] ||= {};
          return (...args) => {
            const j = JSON.stringify(args);
            if (!(j in this._cache[prop])) {
              this._cache[prop][j] = target[prop](...args);
            }
            return this._cache[prop][j];
          };
        }
        return target[prop];
      },
    });

    this.parser.mixin(this);
    this._wip = false;
  }

  get input() {
    if (this._input === undefined) {
      this._input = this.postParse(this.readFile(this.day));
      if (this.sort) {
        this._input = this._input.sort(this.sort);
      }
    }
    if (this.mutates) {
      return JSON.parse(JSON.stringify(this._input));
    }
    return this._input;
  }

  get mutates() {
    return false;
  }

  postParse(lines) {
    return lines;
  }

  exampleInput({ filename, input, part1, part2 }, ...params) {
    const getFilename = () => {
      if (filename) return filename;
      const filenames = this.examples
        .map(({ filename: fn }) => fn)
        .filter(Boolean)
        .filter((f) => f.startsWith(this.day))
        .filter((f, ix) => f === `${this.day}${ALPHABET[ix]}`);
      return `${this.day}${ALPHABET[filenames.length]}`;
    };
    this.examples.push({
      ix: this.examples.length + 1,
      input,
      filename: input ? undefined : getFilename(),
      part1,
      part2,
      params,
    });
  }

  readFile(filename) {
    const inputFile = resolve(`./inputs/${this.year}/${filename}.txt`);
    const rawData = readFileSync(inputFile, 'utf8');
    const retainEmpty = this.retainEmptyLines;
    this._rawData = rawData.split('\n').filter((it) => retainEmpty || it);
    return this.m.parseInput.call(this, this._rawData);
  }

  expectedResult(part) {
    if (part === 2 && this.day === 25) return null;
    const { [`part${part}`]: expected } = this.answers;
    return expected;
  }

  get parser() {
    return Parsers.PARSER;
  }

  get retainEmptyLines() {
    return false;
  }

  /* c8 ignore next 5 */
  get wip() {
    if (this._wip) return true;
    if (this.expectedResult(1) === undefined || this.expectedResult(2) === undefined) return true;
    return false;
  }

  /* c8 ignore next 3 */
  set wip(value) {
    this._wip = value;
  }

  get sort() {
    return false;
  }

  reset() {
    // no-op
  }

  async run(part, ...params) {
    const result = await (part === 1 ? this.part1(this.input, ...params) : this.part2(this.input, ...params));
    this.reset(this.input, ...params);
    return result;
  }
}
