import { OneNumberPerLineParser } from './one-number-per-line.js';
import { SingleLineStringParser } from './single-line-string.js';
import { SingleLineSplitParser } from './single-line-split.js';
import { MultiLineDelimitedNumbersParser } from './multi-line-delimited-numbers.js';
import { OneStringPerLineParser } from './one-string-per-line.js';
import { ReduceParser } from './reduce.js';
import { SingleLineConstructorParser } from './single-line-constructor.js';

export const ONE_NUMBER_PER_LINE = new OneNumberPerLineParser();

export const SINGLE_LINE_STRING = new SingleLineStringParser();

export const SINGLE_LINE_SPLIT = new SingleLineSplitParser();

export const MULTI_LINE_DELIMITED_NUMBERS = new MultiLineDelimitedNumbersParser();

export const ONE_STRING_PER_LINE = new OneStringPerLineParser();

export const REDUCE = new ReduceParser();

export const SINGLE_LINE_CONSTRUCTOR = new SingleLineConstructorParser();
