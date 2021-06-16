import {
  Stmt,
  Enclosing,
  stmtNull
} from "./stmt";

export default class Break extends Stmt {
  constructor() {
    super();
    if (Enclosing == stmtNull) this.error('unenclosed break');
    this.stmt = Enclosing;
  }

  gen = (b, a) => {
    this.emit('goto L' + this.stmt.after);
  }
}