import Expr from "./Expr";

export default class Id extends Expr {
  key = 0;
  now = 0;
  offset = 0;

  constructor(id, p, b) {
    super(id, p);
    this.offset = b;
    this.key = this.now++;
  }

  toString = () => {
    return this.op.lexeme + '(' + this.key + ')';
  }
}