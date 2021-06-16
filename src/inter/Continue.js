import {
  Stmt,
  Enclosing,
  stmtNull
} from "./stmt";

export default class Continue extends Stmt {
  constructor() {
    super();
    if (Enclosing == stmtNull) this.error('unenclosed continue');
    this.stmt = Enclosing;
  }

  gen = (b, a) => {
    this.emit('goto L' + this.stmt.after);
  }
}