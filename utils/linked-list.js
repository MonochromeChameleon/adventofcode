class ListNode {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }

  get values() {
    return this.next ? [this.value, ...this.next.values] : [this.value];
  }

  insertAfter(value) {
    const oldNext = this.next;
    if (value instanceof ListNode) {
      value.prev = this;
      value.next = oldNext;
      this.next = value;
    } else {
      this.next = new ListNode(value, this, oldNext);
    }
    if (oldNext) oldNext.prev = this.next;
  }

  pop() {
    if (this.prev) this.prev.next = this.next;
    if (this.next) this.next.prev = this.prev;
    return this.value;
  }
}

export class CircularLinkedList {
  constructor(...items) {
    this.head = null;
    this._length = 0;

    this.add(...items);
  }

  get tail() {
    return this.head.prev;
  }

  add(item, ...items) {
    const appends = this.head === null ? items : [item, ...items];

    if (this.head === null) {
      this.head = new ListNode(item);
      this._length = 1;

      this.head.next = this.head;
      this.head.prev = this.head;
    }

    appends.forEach((a) => this.tail.insertAfter(a));
    this._length += appends.length;

    this.tail.next = this.head;
    this.head.prev = this.tail;
  }

  shift() {
    this._length -= 1;
    const oldHead = this.head;
    this.head = this.head.next;
    return oldHead.pop();
  }

  get length() {
    return this._length;
  }

  get values() {
    this.tail.next = null;
    const values = this.head.values;
    this.tail.next = this.head;
    return values;
  }

  forEach(fn) {
    this.tail.next = null;
    let next = this.head;
    let i = 0;
    while (next) {
      fn(next, i);
      next = next.next;
      i += 1;
    }
    this.tail.next = this.head;
  }
}

export class BigCircularLinkedList extends CircularLinkedList {
  constructor(array) {
    super(array[0]);
    for (let i = 1; i < array.length; i += 1) {
      this.add(array[i]);
    }
  }
}
