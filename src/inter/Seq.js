import {
  Stmt,
  stmtNull
} from "./stmt";

export default class Seq extends Stmt {
  constructor(s1, s2) {
    super()
    this.stmt1 = s1;
    this.stmt2 = s2;
  }

  gen = (b, a) => {
    if (this.stmt1 == stmtNull) {
      this.stmt2.gen(b, a);
    } else if (this.stmt2 == stmtNull) {
      this.stmt1.gen(b, a);
    } else {
      const label = this.newlabel();
      // console.log('test0');
      this.stmt1.gen(b, label);
      // console.log('test1');
      this.emitlabel(label);
      // console.log('tes2t');
      this.stmt2.gen(label, a);
      // console.log('test3');
    }
  }
}