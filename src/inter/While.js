import {
  TYPE
} from "../symbols/Type";
import {
  Stmt,
  Enclosing
} from "./stmt";

export default class While extends Stmt {
  constructor() {
    super();
    this.expr = Enclosing;
    this.stmt = Enclosing;
  }

  init = (x, s) => {
    this.expr = x;
    this.stmt = s;
    if (this.expr.type != TYPE.Bool) {
      this.expr.error("boolean required in while");
    }
  }

  gen = (b, a) => {
    this.after = a;
    // console.log('new label55555555555555555')
    this.expr.jumping(0, a);
    const label = this.newlabel();
    this.emitlabel(label)
    this.stmt.gen(label, b);
    this.emit('goto L' + b);
  }
}