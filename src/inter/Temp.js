import { WORD } from "../lexer/Word";
import Expr from "./Expr";

let count = 0;


export default class Temp extends Expr {

  number = 0;

  constructor(p) {
    super(WORD.temp, p);
    this.number = ++count
  }

  toString = () => {
    return `t${this.number}`
  }
}