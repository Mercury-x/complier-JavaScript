import Id from '../inter/Id'
import Token from '../lexer/Token'

export default class Env {
  constructor(n) {
    this.table = {} // hashTable
    this.prev = n;
  }

  put = (w, i) => {
    this.table[w.lexeme] = i;
  }

  get = (w) => {
    for (let e = this; e != null; e = e.prev) {
      const found = e.table[w.lexeme]
      if (found != undefined) return found;
    }
    return null;
  }
}