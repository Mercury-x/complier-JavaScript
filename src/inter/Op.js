import Expr from "./Expr";
import Temp from "./Temp";
 
export default class Op extends Expr {
  constructor(tok, p) {
    super(tok, p);
  }

  reduce = () => {
    const x = this.gen();
    const t = new Temp(this.type);
    this.emit(t.toString() + ' = ' + x.toString());
    return t;
  }
}