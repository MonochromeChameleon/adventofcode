export const compose =
  (...funcs) =>
  (val) =>
    funcs.reduce((v, f) => f(v), val);

export const multiPredicate =
  (...predicates) =>
  (val) =>
    predicates.every((predicate) => predicate(val));
