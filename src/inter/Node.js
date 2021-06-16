import {
  Lexer,
  line
} from "../lexer/Lexer";

let labels = 0; // 跳转语句标识L

export default class Node {
  lexline = 0;

  constructor() {
    this.lexline = line;
  }

  error(s) {
    throw new Error(`near line ${this.lexline}: ${s}`);
  }


  // 生成三地址码////////////////////

  newlabel = () => {
    return ++labels;
  }

  emitlabel = (i) => {
    console.log(`L${i}:`)
  }

  emit = (s) => {
    console.log('\t' + s)
  }
  ////////////////////////////////////
}