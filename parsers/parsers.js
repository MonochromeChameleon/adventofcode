import { DaisyChainParser } from './daisy-chain.js';
import { FlatMapParser } from './flat-map.js';
import { FlatMapDelimitedNumbersParser } from './flat-map-delimited-numbers.js';
import { GameOfLifeParser } from './game-of-life.js';
import { GridParser } from './grid.js';
import { GroupParser } from './group.js';
import { InstructionsParser } from './instructions.js';
import { MazeParser } from './maze.js';
import { MultiLineConstructorParser } from './multi-line-constructor.js';
import { MultiLineDelimitedNumbersParser } from './multi-line-delimited-numbers.js';
import { MultiLineDelimitedIntegersWithCruftParser } from './multi-line-delimited-integers-with-cruft.js';
import { MultiLineSplitParser } from './multi-line-split.js';
import { MultiplePatternsParser } from './multiple-patterns.js';
import { OneNumberPerLineParser } from './one-number-per-line.js';
import { OneStringPerLineParser } from './one-string-per-line.js';
import { Parser } from './parser.js';
import { PropertyListParser } from './property-list.js';
import { ReduceParser } from './reduce.js';
import { RegexParser } from './regex.js';
import { SingleLineConstructorParser } from './single-line-constructor.js';
import { SingleLineDelimitedNumbersParser } from './single-line-delimited-numbers.js';
import { SingleLineParser } from './single-line-map.js';
import { SingleLineSplitParser } from './single-line-split.js';
import { SingleLineSplitMapParser } from './single-line-split-map.js';
import { SingleLineStringParser } from './single-line-string.js';
import { SingleNumberParser } from './single-number.js';
import { SingleStringParser } from './single-string.js';

function extend(ParserClass, propertyMap = {}) {
  return {
    mixin(target) {
      return new ParserClass(propertyMap).mixin(target);
    },
    withMappedProps(props = {}) {
      return extend(ParserClass, { ...propertyMap, ...props });
    },
  };
}

export const DAISY_CHAIN = extend(DaisyChainParser);
export const FLAT_MAP_DELIMITED_NUMBERS = extend(FlatMapDelimitedNumbersParser);
export const FLAT_MAP = extend(FlatMapParser);
export const GAME_OF_LIFE = extend(GameOfLifeParser);
export const GRID = extend(GridParser);
export const GROUP = extend(GroupParser);
export const INSTRUCTIONS = extend(InstructionsParser);
export const MAZE = extend(MazeParser);
export const MULTI_LINE_DELIMITED_INTEGERS_WITH_CRUFT = extend(MultiLineDelimitedIntegersWithCruftParser);
export const MULTI_LINE_DELIMITED_NUMBERS = extend(MultiLineDelimitedNumbersParser);
export const MULTI_LINE_CONSTRUCTOR = extend(MultiLineConstructorParser);
export const MULTI_LINE_SPLIT = extend(MultiLineSplitParser);
export const MULTIPLE = extend(MultiplePatternsParser);
export const ONE_NUMBER_PER_LINE = extend(OneNumberPerLineParser);
export const ONE_STRING_PER_LINE = extend(OneStringPerLineParser);
export const PARSER = extend(Parser);
export const PROPERTY_LIST = extend(PropertyListParser);
export const REDUCE = extend(ReduceParser);
export const REGEX = extend(RegexParser);
export const SINGLE_LINE_CONSTRUCTOR = extend(SingleLineConstructorParser);
export const SINGLE_LINE_DELIMITED_NUMBERS = extend(SingleLineDelimitedNumbersParser);
export const SINGLE_LINE = extend(SingleLineParser);
export const SINGLE_LINE_SPLIT = extend(SingleLineSplitParser);
export const SINGLE_LINE_SPLIT_MAP = extend(SingleLineSplitMapParser);
export const SINGLE_LINE_STRING = extend(SingleLineStringParser);
export const SINGLE_NUMBER = extend(SingleNumberParser);
export const SINGLE_STRING = extend(SingleStringParser);
