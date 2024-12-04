function getAllMethodNames(obj) {
  if (obj === null) return [];
  return new Set([...Reflect.ownKeys(obj), ...getAllMethodNames(Reflect.getPrototypeOf(obj))]);
}

export class Parser {
  constructor(propertyMap = {}) {
    this.propertyMap = propertyMap;
  }

  mappedPropertyName(name) {
    return this.propertyMap[name] || name;
  }

  get split() {
    return '';
  }

  parseValue(value) {
    return value;
  }

  parseLine(line) {
    return line;
  }

  parseInput(lines) {
    return lines.map(this.m.parseLine.bind(this)).filter((it) => it !== undefined);
  }

  mixin(tgt) {
    const parserProps = getAllMethodNames(this);
    const tgtProps = getAllMethodNames(tgt);

    const propsToAdd = [...parserProps].filter(
      (prop) =>
        (!tgtProps.has(prop) || Object.hasOwnProperty.call(this.propertyMap, prop)) &&
        prop !== 'mixin' &&
        prop !== 'propertyMap',
    );

    propsToAdd.forEach((prop) => {
      const mappedProp = this.mappedPropertyName(prop);
      const p = mappedProp in this ? this[mappedProp] : this[prop];
      if (!tgtProps.has(mappedProp)) {
        tgt[mappedProp] = typeof p === 'function' ? p.bind(tgt) : p;
      }
    });

    tgt.propertyMap = { ...this.propertyMap, ...tgt.propertyMap };

    tgt.mixout = () => {
      propsToAdd.forEach((prop) => {
        delete tgt[prop];
      });
      Object.keys(this.propertyMap).forEach((prop) => {
        delete tgt.propertyMap[prop];
      });
      delete tgt.mixout;
      return tgt;
    };

    return tgt;
  }
}
