import {
  TYPE2,
  TYPE
} from "../symbols/Type";
import Op from "./Op";

export default class Unary extends Op {
  constructor(tok, x) {
    super(tok, null);
    this.expr = x;
    this.type = TYPE2.max(TYPE.Int, this.expr.type);
    if (type == null) this.error('type error');
  }

  gen = () => {
    return new Unary(this.op, this.expr.reduce());
  }

  toString = () => {
    return this.op.toString() + ' ' + this.expr.toString();
  }
}