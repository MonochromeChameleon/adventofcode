import { QuestionBase } from '../../utils/question-base.js';

export class Question extends QuestionBase {
  constructor() {
    super(2020, 21, 2176, 'lvv,xblchx,tr,gzvsg,jlsqx,fnntr,pmz,csqc');

    this.exampleInput({ part1: 5, part2: 'mxmxvkd,sqjhc,fvjkl' });
  }

  parseLine(line) {
    const [ingredients, allergens] = line
      .substr(0, line.length - 1)
      .replace(/,/g, '')
      .split('(contains')
      .map((x) => x.trim().split(/\s+/));

    return { ingredients, allergens };
  }

  findAllergenIds(input) {
    const allergens = [...new Set(input.flatMap(({ allergens: a }) => a))];
    return Object.fromEntries(
      allergens.map((a) => {
        const recipes = input.filter((r) => r.allergens.includes(a));
        const ingredients = recipes
          .slice(1)
          .reduce((ing, r) => ing.filter((i) => r.ingredients.includes(i)), recipes[0].ingredients);
        return [a, ingredients];
      }),
    );
  }

  part1(input) {
    const allergenIds = this.findAllergenIds(input);
    const maybeAllergenIngredients = [...new Set(Object.values(allergenIds).flat())];
    const nonAllergenIngredients = input
      .flatMap(({ ingredients }) => ingredients)
      .filter((i) => !maybeAllergenIngredients.includes(i));
    return nonAllergenIngredients.length;
  }

  part2(input) {
    const allergenIds = this.findAllergenIds(input);
    while (Object.values(allergenIds).some((all) => all.length > 1)) {
      const identified = Object.values(allergenIds)
        .filter((all) => all.length === 1)
        .flat();
      Object.keys(allergenIds).forEach((all) => {
        if (allergenIds[all].length > 1) {
          allergenIds[all] = allergenIds[all].filter((i) => !identified.includes(i));
        }
      });
    }

    return Object.entries(allergenIds)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, [ingredient]]) => ingredient)
      .join(',');
  }
}
