import Node from "./Node";

export default class Expr extends Node {


  constructor(tok, p) {
    super();
    this.op = tok;
    this.type = p;
  }

  // gen()返回一个项，该项可以成为三地址指令的右部
  // 给定表达式 E = E1 + E2, gen()返回一个项 x1 + x2, 其中x1和x2分别是存放E1和E2值的地址
  // 如果这个对象是一个地址，就可以返回this值
  // Expr的子类通常会重新实现gen
  gen = () => {
    return this;
  }

  // reduce()把表达式计算（归约）成为一个单一的地址
  // 它返回一个常量，一个标识符，或一个临时名字
  // 给定一个表达式E，reduce返回一个存放E的值的临时变量t
  reduce = () => {
    return this;
  }

  jumping = (t, f) => {
    this.emitjumps(this.toString(), t, f);
  }

  emitjumps = (test, t, f) => {
    if (t != 0 && f != 0) {
      this.emit("if " + test + " goto L" + t);
      this.emit("goto L" + f);
    } else if (t != 0) {
      this.emit("if " + test + " goto L" + t);
    } else if (f != 0) {
      this.emit("if not " + test + " goto L" + f);
    } else
    ; // 不生成指令，因为t和f都直接穿越
  }

  toString = () => {
    return this.op.toString();
  }
}