import Token from "../lexer/Token";
import {
  Type,
  TYPE
} from "../symbols/Type";
import Expr from "./Expr";
import Temp from "./Temp";

/**
 * 为类Or，And，Not提供了一些常见功能
 */
export default class Logical extends Expr {
  /**
   * 构造出语法树的一个节点，其运算符为tok，运算分量为a和b; 完成时调用check来保证a和b都是bool类型
   * 
   * @param tok
   * @param x1
   * @param x2
   */
  constructor(tok, x1, x2) {
    super(tok, null);
    this.expr1 = x1;
    this.expr2 = x2;
    // console.log(x1.type)
    // console.log(x2.type)
    this.type = TYPE.Bool;
    // this.check(this.expr1.type, this.expr2.type);
    if (this.type == null)
      this.error("type error");
  }

  check = (p1, p2) => {
    if (p1 == TYPE.Bool && p2 == TYPE.Bool)
      return TYPE.Bool;
    else return null;
  }

  gen = () => {
    f = this.newlabel();
    a = this.newlabel();
    temp = new Temp(this.type);
    this.jumping(0, f);
    this.emit(temp.toString() + ' = true');
    this.emit('goto L' + a);
    this.emitlabel(f);
    this.emit(temp.toString() + ' = false');
    this.emitlabel(a);
    return temp;
  }

  toString = () => {
    return this.expr1.toString() + " " + this.op.toString() + " " + this.expr2.toString();
  }
}