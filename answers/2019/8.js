import { QuestionBase, Parsers } from '../../utils/question-base.js';
import { letterSlice, getLetter, printLetters } from '../../utils/grid-letters.js';

export class Question extends QuestionBase {
  constructor() {
    super(2019, 8, 1806, 'JAFRA');
  }

  get parser() {
    return Parsers.SINGLE_LINE_DELIMITED_NUMBERS;
  }

  part1(input, width = 25, height = 6) {
    const layerSize = width * height;
    const count = (tgt) => (arr) => arr.filter((it) => it === tgt).length;
    const count0 = count(0);
    const count1 = count(1);
    const count2 = count(2);

    const layers = Array.from({ length: input.length / layerSize }).map((no, ix) =>
      input.slice(ix * layerSize, (ix + 1) * layerSize)
    );
    const [minLayer] = layers.sort((a, b) => count0(a) - count0(b));
    return count1(minLayer) * count2(minLayer);
  }

  part2(input, width = 25, height = 6) {
    const layerSize = width * height;
    const TRANSPARENT = 2;

    const pixelValueAtIndex = (ix, [topLayer, ...layers]) => {
      if (!topLayer) return TRANSPARENT;
      if (topLayer[ix] === TRANSPARENT) return pixelValueAtIndex(ix, layers);
      return topLayer[ix];
    };

    const layers = Array.from({ length: input.length / layerSize }).map((no, ix) =>
      input.slice(ix * layerSize, (ix + 1) * layerSize)
    );
    const output = Array.from({ length: layerSize })
      .map((no, ix) => pixelValueAtIndex(ix, layers))
      .map((it) => (it ? '#' : '.'));

    const slices = letterSlice(output, width, 5);
    const letters = slices.map((slice) => getLetter(slice));
    printLetters(output, width);

    return letters.join('');
  }
}
