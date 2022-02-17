import { QuestionBase, Parsers } from '../../utils/question-base.js';

function getPossibleMeasurements(amount, first, ...ingredients) {
  if (!amount) return [{}];
  if (!ingredients.length) return [{ [first]: amount }];
  return Array.from({ length: amount + 1 }).flatMap((_, i) => {
    const rest = getPossibleMeasurements(amount - i, ...ingredients);
    return rest.map((r) => ({ ...r, [first]: i }));
  });
}

class Ingredient {
  constructor(line) {
    const [name, details] = line.split(':');
    this.name = name;

    const { capacity, durability, flavor, texture, calories } = Object.fromEntries(
      details
        .split(',')
        .map((p) => p.trim().split(' '))
        .map(([p, value]) => [p, Number(value)])
    );

    this.capacity = capacity;
    this.durability = durability;
    this.flavor = flavor;
    this.texture = texture;
    this.calories = calories;
  }

  score(amount) {
    return {
      capacity: this.capacity * amount,
      durability: this.durability * amount,
      flavor: this.flavor * amount,
      texture: this.texture * amount,
      calories: this.calories * amount,
    };
  }
}

export class Question extends QuestionBase {
  constructor() {
    super(2015, 15, 13882464, 11171160);

    this.exampleInput({ part1: 62842880, part2: 57600000 });
  }

  get parser() {
    return Parsers.MULTI_LINE_CONSTRUCTOR;
  }

  get inputConstructor() {
    return Ingredient;
  }

  getScore(ingredients, measurements) {
    const { capacity, durability, flavor, texture, calories } = Object.entries(measurements)
      .map(([ingredient, amount]) => ingredients[ingredient].score(amount))
      .reduce((acc, score) => ({
        capacity: acc.capacity + score.capacity,
        durability: acc.durability + score.durability,
        flavor: acc.flavor + score.flavor,
        texture: acc.texture + score.texture,
        calories: acc.calories + score.calories,
      }));

    const score = Math.max(0, capacity) * Math.max(0, durability) * Math.max(0, flavor) * Math.max(0, texture);
    return { score, calories };
  }

  possibleMeasurements(ingredients) {
    return getPossibleMeasurements(100, ...Object.keys(ingredients));
  }

  allScores(ingredients) {
    return this.possibleMeasurements(ingredients).map((m) => this.getScore(ingredients, m));
  }

  part1(ing) {
    const ingredients = ing.reduce((out, i) => ({ ...out, [i.name]: i }), {});
    return this.allScores(ingredients).reduce((acc, { score }) => Math.max(acc, score), 0);
  }

  part2(ing) {
    const ingredients = ing.reduce((out, i) => ({ ...out, [i.name]: i }), {});
    return this.allScores(ingredients)
      .filter((m) => m.calories === 500)
      .reduce((acc, { score }) => Math.max(acc, score), 0);
  }
}
