class ListNode {
  constructor(value, prev = null, next = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }

  get tail() {
    return this.next ? this.next.tail : this;
  }

  get length() {
    return this.next ? this.next.length + 1 : 1;
  }

  find(value) {
    if (this.value === value) {
      return this;
    }
    if (this.next) {
      return this.next.find(value);
    }
    return null;
  }

  insertAfter(value) {
    const oldNext = this.next;
    this.next = new ListNode(value, this, oldNext);
    if (oldNext) oldNext.prev = this.next;
  }

  insertBefore(value) {
    const oldPrev = this.prev;
    this.prev = new ListNode(value, oldPrev, this);
    if (oldPrev) oldPrev.next = this.prev;
  }

  pop() {
    if (this.prev) this.prev.next = this.next;
    if (this.next) this.next.prev = this.prev;
    return this.value;
  }

  toString() {
    if (this.next) return `${this.value}, ${this.next.toString()}`;
    return `${this.value}`;
  }
}

export class LinkedList {
  constructor(...items) {
    this.head = null;
    this._tail = null;

    this.add(...items);
  }

  get tail() {
    if (this.circular) return this.head.prev;
    if (this._tail && !this._tail.next) return this._tail;
    if (this._tail) {
      this._tail = this._tail.tail;
    } else if (this.head) {
      this._tail = this.head.tail;
    }
    return this._tail;
  }

  add(item, ...items) {
    const appends = this.head === null ? items : [item, ...items];

    if (this.head === null) {
      this.head = new ListNode(item);
      this._tail = this.head;
      if (this.circular) {
        this.head.next = this.head;
        this.head.prev = this.head;
      }
    }

    appends.forEach((a) => this.tail.insertAfter(a));

    if (this.circular) {
      this.tail.next = this.head;
      this.head.prev = this.tail;
    }
  }

  find(value) {
    return this.head.find(value);
  }

  pop() {
    return this.tail.remove();
  }

  shift() {
    return this.head.remove();
  }

  get length() {
    return this.head.length;
  }

  get circular() {
    return false;
  }

  toString() {
    this.tail.next = null;
    const str = this.head.toString();
    if (this.circular) this.tail.next = this.head;
    return `[${str}]`;
  }
}

export class CircularLinkedList extends LinkedList {
  get circular() {
    return true;
  }
}
