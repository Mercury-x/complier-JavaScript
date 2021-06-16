export default class Token {
  constructor(t) {
    this.tag = t;
  }

  toString = () => {
    return `${this.tag}`
  }
}