import { QuestionBase } from '../../utils/question-base.js';
import { mapBy } from '../../utils/count-by-value.js';

const ONE_TRILLION = 1000000000000;

class Chemical {
  constructor(name, amountProduced, recipe, level = undefined) {
    this.name = name;
    this.amountProduced = amountProduced;
    this.recipe = recipe;
    this.level = level;
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2019, 14, 97422, 13108426);

    this.exampleInput({ part1: 31 });
    this.exampleInput({ part1: 165 });
    this.exampleInput({ part1: 13312 });
    this.exampleInput({ part1: 180697 });
    this.exampleInput({ part1: 2210736 });
  }

  parseLine(line) {
    const [, reaction, amountProduced, name] = /^(.+) => (\d+) (\w+)/.exec(line);
    const recipe = reaction
      .split(',')
      .map((it) => /(\d+) (\w+)/.exec(it))
      .map(([, amount, chemical]) => [chemical, Number(amount)]);

    return new Chemical(name, Number(amountProduced), Object.fromEntries(recipe));
  }

  requiredOre(chemical, chemistrySet) {
    const empty = Object.fromEntries(Object.keys(chemistrySet).map((name) => [name, 0]));
    const recipe = { ORE: 0, ...empty, ...chemical.recipe };
    for (let l = chemical.level - 1; l > 0; l -= 1) {
      Object.keys(recipe)
        .map((name) => chemistrySet[name])
        .filter(({ level }) => level === l)
        .forEach((c) => {
          Object.entries(c.recipe).forEach(([k, a]) => {
            recipe[k] += a * Math.ceil(recipe[c.name] / c.amountProduced);
          });
        });
    }
    return recipe.ORE;
  }

  estimate(guess, input) {
    const magic = new Chemical('MAGIC', 1, { FUEL: guess }, input.FUEL.level + 1);
    const magicResult = this.requiredOre(magic, input);

    const spare = ONE_TRILLION - magicResult;
    const orePerFuel = Math.ceil(magicResult / guess);

    return { guess: guess + Math.floor(spare / orePerFuel), terminated: spare / orePerFuel < 1 };
  }

  postParse(lines) {
    const mapped = mapBy(lines, (it) => it.name);

    const assignLevels = (tgt) => {
      if (tgt.level) return;
      if (Object.keys(tgt.recipe).length === 1 && 'ORE' in tgt.recipe) {
        tgt.level = 1;
        return;
      }
      Object.keys(tgt.recipe).forEach((k) => assignLevels(mapped[k]));
      tgt.level = Math.max(...Object.keys(tgt.recipe).map((k) => mapped[k].level)) + 1;
    };

    assignLevels(mapped.FUEL, mapped);
    return { ORE: { level: 0 }, ...mapped };
  }

  part1(input) {
    return this.requiredOre(input.FUEL, input);
  }

  part2(input) {
    let out = this.estimate(1, input);
    while (!out.terminated) out = this.estimate(out.guess, input);
    return out.guess;
  }
}
