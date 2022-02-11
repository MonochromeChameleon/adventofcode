function getAllMethodNames(obj) {
  if (obj === null) return [];
  return new Set([...Reflect.ownKeys(obj), ...getAllMethodNames(Reflect.getPrototypeOf(obj))]);
}

export class Parser {
  get split() {
    return '';
  }

  parseLine(line) {
    return line;
  }

  parseInput(lines) {
    return lines.map(this.parseLine.bind(this)).filter((it) => it !== undefined);
  }

  mixin(tgt) {
    const parserProps = getAllMethodNames(this);
    const tgtProps = getAllMethodNames(tgt);

    const propsToAdd = [...parserProps].filter(prop => !tgtProps.has(prop) && prop !== 'mixin');

    propsToAdd.forEach((prop) => {
      const p = this[prop];
      tgt[prop] = typeof p === 'function' ? p.bind(tgt) : p;
    });

    tgt.mixout = () => {
      propsToAdd.forEach((prop) => {
        delete tgt[prop];
      });
      delete tgt.mixout;
      return tgt;
    }

    return tgt;
  }
}
