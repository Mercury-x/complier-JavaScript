import Node from "./Node";

export class Stmt extends Node {

  /**
   * 调用时的参数是语句开始处的标号和语句的下一条指令的标号 方法gen是子类gen方法的占位符
   * 
   * @param b 标记这个语句代码的开始处
   * @param a 标记这个语句的代码之后的第一条指令
   */
  gen = (b, a) => {}

  after = 0; // 保存语句的下一条指令的标号
  // int begin = 0;
  // Enclosing = this.Null;
}

export let Enclosing = new Stmt();

export let stmtNull = new Stmt();

export function updateStmtEnclousing(a) {
  Enclosing = a;
  console.log('**********change enclosing************')
  console.log(a)
  console.log('**************************************')
}