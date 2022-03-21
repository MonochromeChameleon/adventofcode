export class Maybe {
  constructor(valueOrNull) {
    this.value = valueOrNull;
  }

  static of(value) {
    return new Maybe(value);
  }

  static empty() {
    return new Maybe(null);
  }

  hasValue() {
    return !this.isNothing();
  }

  isNothing() {
    return this.value === null || this.value === undefined;
  }

  map(fn) {
    if (this.isNothing()) {
      return this;
    }

    return Maybe.of(fn(this.value));
  }

  maybeBaby(fn) {
    if (this.isNothing()) {
      return fn();
    }

    return this;
  }

  orElse(defaultValue) {
    if (this.isNothing()) {
      return defaultValue;
    }

    return this.value;
  }

  getOrThrow(error = new Error('Value is not defined')) {
    if (this.isNothing()) {
      throw error;
    }

    return this.value;
  }
}
