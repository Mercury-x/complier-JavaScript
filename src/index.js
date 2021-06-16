import {
  Lexer
} from '/src/lexer/Lexer'
import Parser from './parser/parser';
import {
  inputCode,
  getNextCh
} from './tool/tool';


const code =
  `{
    int k;
    k = 0;
    if(k>0) {
      k = 3;
    } else {
      int b;
      b = 1;
      b = 2;
    }
    while(k<4){
      int i;
      i = 0;
      if (k > 0) break;
      while(i<4){
        int j;
        j = 0;
        }
        i=i+1;
      }
      k=k+1;
    }
  }`

inputCode(code);
const lex = new Lexer();
const parse = new Parser(lex);
parse.program();

// import {Constant} from './inter/Constant';
// import {WORD} from './lexer/Word';
// import {TYPE} from './symbols/Type'
// import Expr from './inter/Expr'
// console.log(new Expr(1, 2))
// console.log(new Constant(WORD.True, TYPE.Bool, TYPE.Bool))