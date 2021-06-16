import Op from "./Op";
import { TYPE2 } from "../symbols/Type";
// 表示算术运算符
// + - * /
export default class Arith extends Op {
   constructor(tok, x1, x2) {
    /**
     * tok: 表示该运算符的词法单元
     */
    super(tok, null); // null是占位符
    this.expr1 = x1;
    this.expr2 = x2;
    this.type = TYPE2.max(this.expr1.type, this.expr2.type); // 确定类型
    if (this.type == null)
      error("type error");
  }

  gen = () => {
    /**
     * 把子表达式规约为地址，并将表达式的运算符作用于这些地址. 假设gen在a+b*c的根部被调用.
     * 其中对reduce的调用返回a作为子表达式a的地址，并返回t作为b*c的地址. 同时reduce还生成指令t = b * c.
     * 方法gen返回了一个新的Arith节点，其中运算符是*, 而运算分量是地址a和t.
     */
    return new Arith(this.op, this.expr1.reduce(), this.expr2.reduce());
  }

  toString = () => {
    return this.expr1.toString() + " " + this.op.toString() + " " + this.expr2.toString();
  }
}
