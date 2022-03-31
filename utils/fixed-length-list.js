export class FixedLengthList {
  constructor(length, ...items) {
    this.length = length;
    this.list = new Array(length).fill(null);
    this.add(...items);
  }

  add(...items) {
    items.forEach((item) => {
      this.list.shift();
      this.list.push(item);
    });
  }

  equals(other) {
    if (other.length !== this.length) /* c8 ignore next */ return false;
    return this.list.every((item, index) => item === other[index]);
  }
}
