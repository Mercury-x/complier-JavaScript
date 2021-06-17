import {
  TYPE
} from "../symbols/Type";
import {
  Stmt,
  Enclosing
} from "./stmt";

// for (stmt1; expr; stmt2) { stmt } 
export default class For extends Stmt {
  constructor() {
    super();
    this.expr = Enclosing;
    this.stmt = Enclosing;
    this.stmt1 = Enclosing;
    this.stmt2 = Enclosing;
  }

  init = (x, s1, s2, s) => {
    this.expr = x;
    this.stmt = s;
    this.stmt1 = s1;
    this.stmt2 = s2;
    if (this.expr.type != TYPE.Bool) {
      this.expr.error("boolean required in while");
    }
  }

  gen = (b, a) => {
    this.after = a;
    this.stmt1.gen();
    // console.log('new label55555555555555555')
    this.expr.jumping(0, a);
    const label = this.newlabel();
    this.emitlabel(label)
    this.stmt.gen(label, b);
    this.stmt2.gen();
    this.emit('goto L' + b);
  }
}