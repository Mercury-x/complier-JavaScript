import Access from "../inter/Access";
import {
  line
} from "../lexer/Lexer";
import Array from "../symbols/Array";
import Arith from "../inter/Arith";
import {
  CFalse,
  Constant,
  CTrue
} from "../inter/Constant";
import Do from "../inter/Do";
import Else from "../inter/Else";
import Id from "../inter/Id";
import IF from "../inter/If";
import Not from "../inter/Not";
import Or from "../inter/Or";
import Rel from "../inter/Rel";
import Seq from "../inter/Seq";
import Set from "../inter/Set";
import {
  Enclosing,
  stmtNull,
  updateStmtEnclousing
} from '../inter/stmt';
import Unary from "../inter/Unary";
import While from "../inter/While";
import For from "../inter/For";
import Tag from "../lexer/Tag";
import {
  WORD
} from "../lexer/Word";
import Env from "../symbols/Env";
import And from "../inter/And";
import {
  Type,
  TYPE
} from "../symbols/Type";
import SetElem from "../inter/SetElem";
import {
  nowChCode,
  printNext
} from "../tool/tool";
import Token from "../lexer/Token";
import Break from "../inter/Break";
import Continue from "../inter/Continue";


export default class Parser {
  used = 0;
  top = null; // env
  lex = null;
  look = null;

  constructor(lex) {
    this.lex = lex;
    this.move();
  }

  move = () => {
    this.look = this.lex.scan();
    // console.log('look', this.look)
  }

  error = (s) => {
    throw new Error(`near line ${line}: ${s}`);
    // console.log(`near line ${line}: ${s}`)
  }

  match = (t) => {
    // console.log('match: ', this.look.tag, t)
    // console.log('##########1')
    // console.log(nowChCode())
    // console.log('##########2')
    // console.log(this.look.tag, t, 'asdasd')
    if (this.look.tag === t) {
      this.move();
    } else {
      this.error("syntax error");
    }
  }

  program = () => {
    let s = this.block();
    // 生成中间代码////////////////
    console.log('-----------------------------------------抽象语法树-----------------------------------------')
    console.log(s);
    console.log('--------------------------------------------end--------------------------------------------')
    console.log('------------------------------------------三地址码------------------------------------------')
    const begin = s.newlabel();
    const after = s.newlabel();
    s.emitlabel(begin);
    s.gen(begin, after);
    s.emitlabel(after);
    console.log('--------------------------------------------end--------------------------------------------')
    /////////////////////////////
  }

  block = () => {
    this.match('{');
    const saveEnv = this.top;
    this.top = new Env(this.top);
    // console.log(this.top)
    let s = this.stmts();
    this.match('}');
    this.top = saveEnv;
    return s;
  }

  decls = () => {
    while (this.look.tag == Tag.BASIC) {
      // console.log('in decls')
      // console.log('indeclsssssssssssssssssssssssssssssssssssssssssssss')
      let p = this.type();
      while (true) {
        let tok = this.look;
        this.match(Tag.ID);
        let id = new Id(tok, p, this.used);

        // console.log('$$$$$$$$$$$$$$$$$$4')
        // console.log(tok)
        // console.log(this.top)
        if (this.top.table[tok.tag] == null) this.top.put(tok, id);
        else error("redefine of id " + tok.toString());

        this.used += p.width;

        if (this.look.tag == ';') {
          this.match(';');
          break;
        } else if (this.look.tag == '=') {
          this.match('=');
        } else {
          this.match(',');
        }
      }
    }
  }

  type = () => {
    console.log('intype************************')
    console.log(this.look)

    // 获得数组类型长度
    let width = 0;
    if (this.look.tag == TYPE.Int.tag) width = TYPE.Int.width;
    else if (this.look.tag == TYPE.Float.tag) width = TYPE.Float.width;
    else if (this.look.tag == TYPE.Char.tag) width = TYPE.Char.width;
    else if (this.look.tag == TYPE.Bool.tag) width = TYPE.Bool.width;
    const p = new Type(this.look.lexeme, this.look.tag, width);
    this.match(Tag.BASIC);
    if (this.look.tag != '[') {
      return p;
    } else {
      console.log('match ')
      return this.dims(p);
    }
  }

  dims = (p) => {
    this.match('[');
    console.log('findfindfindfindfindfindfindfindfindfindfindfind')
    const tok = this.look;
    this.match(Tag.NUM);
    this.match(']');
    console.log('match ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]')
    if (this.look.tag == '[') {
      p = this.dims(p);
    }
    console.log('tokkkkkkkkkkkkkkkkkk')
    console.log(p);
    return new Array(tok.value, p);
  }

  stmt = () => {
    let x, s, s1, s2, savedStmt;
    switch (this.look.tag) {
      case ';':
        this.move();
        return stmtNull;
      case Tag.IF:
        this.match(Tag.IF);
        this.match('(');
        x = this.bool();
        this.match(')');
        s1 = this.stmt();
        if (this.look.tag != Tag.ELSE)
          return new IF(x, s1);
        this.match(Tag.ELSE);
        s2 = this.stmt();
        return new Else(x, s1, s2);
      case Tag.WHILE:
        const whilenode = new While();
        savedStmt = Enclosing;
        updateStmtEnclousing(whilenode);
        this.match(Tag.WHILE);
        this.match('(');
        x = this.bool();
        this.match(')');
        s1 = this.stmt();
        whilenode.init(x, s1);
        updateStmtEnclousing(savedStmt);
        // Enclosing = savedStmt;
        return whilenode;
      case Tag.DO:
        const donode = new Do();
        savedStmt = Enclosing;
        updateStmtEnclousing(donode);
        // Enclosing = donode;
        this.match(Tag.DO);
        s1 = this.stmt();
        this.match(Tag.WHILE);
        this.match('(');
        x = this.bool();
        this.match(')');
        this.match(';');
        donode.init(s1, x);
        updateStmtEnclousing(savedStmt);
        // Enclosing = savedStmt;
        return donode;
      case Tag.FOR:
        const fornode = new For();
        savedStmt = Enclosing;
        updateStmtEnclousing(fornode);
        this.match(Tag.FOR);
        this.match('(');
        // 匹配第一个赋值语句（可以为空
        console.log('look')
        console.log(this.look)
        if (this.look.tag != ';') {
          let t = this.look;
          this.match(Tag.ID);
          let id = this.top.get(t);
          this.match('=');
          s1 = new Set(id, this.bool());
        } else {
          s1 = stmtNull;
        }
        // 匹配判断
        console.log(this.look)
        this.match(';')
        x = this.bool();
        // 匹配第二个赋值语句（可以为空
        this.match(';')
        if (this.look.tag != ';') {
          let t = this.look;
          this.match(Tag.ID);
          let id = this.top.get(t);
          this.match('=');
          s2 = new Set(id, this.bool());
        } else {
          this.match(';')
          s2 = stmtNull;
        }
        console.log('look')
        console.log(this.look)
        this.match(')');
        s = this.stmt();
        fornode.init(x, s1, s2, s);
        updateStmtEnclousing(savedStmt);
        return fornode;
      case Tag.BREAK:
        this.match(Tag.BREAK);
        this.match(';');
        return new Break();
      case Tag.CONTINUE:
        this.match(Tag.CONTINUE);
        this.match(';');
        return new Continue();
      case '{':
        return this.block();
      default:
        return this.assign();
    }
  }

  stmts = () => {
    console.log('in stmts')
    console.log(this.look)
    if (this.look.tag === Tag.BASIC)
      this.decls();
    if (this.look.tag === '}')
      return stmtNull;
    else {
      return new Seq(this.stmt(), this.stmts());
    }
  }


  assign = () => {
    let stmt;
    let t = this.look;
    this.match(Tag.ID);
    // console.log('match sucess')
    let id = this.top.get(t);
    console.log(id)
    console.log(this.top)
    if (id == null) {
      this.error(t.toString() + " undeclared");
      throw new Error(t.toString() + " undeclared")
    }
    if (this.look.tag == '=') {
      this.move();
      stmt = new Set(id, this.bool());
    } else {
      console.log(id)
      console.log('in create id-------------------------------------------------------')
      const x = this.offset(id);
      this.match('=');
      stmt = new SetElem(x, this.bool());
    }
    // console.log(nowChCode())
    this.match(';');
    return stmt;
  }

  bool = () => {
    let x = this.join();
    while (this.look.tag == Tag.OR) {
      let tok = new Token(this.look.tag);
      this.move();
      x = new Or(tok, x, this.join());
    }
    return x;
  }

  join = () => {
    let x = this.equality();
    while (this.look.tag == Tag.AND) {
      let tok = new Token(this.look.tag);
      this.move();
      console.log('loo2')
      x = new And(tok, x, this.equality());
    }
    return x;
  }

  equality = () => {
    let x = this.rel();
    console.log('loo1')
    console.log(this.look)
    while (this.look.tag == Tag.EQ || this.look.tag == Tag.NE) {
      const tok = new Token(this.look.tag);
      this.move();
      x = new Rel(tok, x, this.rel());
    }
    return x;
  }

  rel = () => {
    let x = this.expr();
    // console.log('tag')
    // console.log(this.look.tag)
    switch (this.look.tag) {
      case '<':
      case Tag.LE:
      case Tag.GE:
      case '>':
        const tok = new Token(this.look.tag);
        this.move();
        return new Rel(tok, x, this.expr());
      default:
        return x;
    }
  }

  expr = () => {
    let x = this.term();
    while (this.look.tag == '+' || this.look.tag == '-') {
      console.log('in if')
      const tok = new Token(this.look.tag);
      this.move();
      x = new Arith(tok, x, this.term());
    }
    return x;
  }

  term = () => {
    let x = this.unary();
    while (this.look.tag == '*' || this.look.tag == '/') {
      const tok = new Token(this.look.tag);
      this.move();
      x = new Arith(tok, x, this.unary());
    }
    return x;
  }

  unary = () => {
    console.log('loo1')
    console.log(this.look.tag)
    if (this.look.tag == '-') {
      this.move();
      return new Unary(WORD.minus, this.unary());
    } else if (this.look.tag == '!') {
      const tok = new Token(this.look.tag);
      this.move();
      return new Not(tok, this.unary());
    } else
      return this.factor();
  }

  factor = () => {
    let x = null;
    switch (this.look.tag) {
      case '(':
        this.move();
        x = this.bool();
        this.match(')');
        return x;
      case Tag.NUM:
        x = new Constant(this.look, TYPE.Int);
        this.move();
        return x;
      case Tag.REAL:
        x = new Constant(this.look, TYPE.Float);
        this.move();
        return x;
      case Tag.TRUE:
        x = CTrue;
        this.move();
        return x;
      case Tag.FALSE:
        x = CFalse;
        this.move();
        return x;
      case Tag.ID:
        let s = this.look.toString();
        let id = this.top.get(this.look);
        if (id == null)
          error(this.look.toString() + " undeclared");
        this.move();
        // console.log(id)
        if (this.look.tag != '[')
          return id;
        else
          return this.offset(id);
      default:
        // console.log('look tag :' + this.look.tag)
        this.error("syntax error");
        return x;
    }
  }

  /**
   * 处理数组赋值语句
   * 
   * @param {Id} a - 传入的标识符 
   * @returns 
   */
  offset = (a) => {
    console.log('------------------------------------------in offset------------------------------------------------------------------------------------------------------------')
    let i; // expr
    let w; // expr
    let t1, t2; // expr
    let loc; // expr
    let type = a.type;
    console.log(a)
    this.match('[');
    i = this.bool();
    this.match(']');
    try {
      type = type.of;
    } catch (e) {
      // console.log(e);
      error("this object doesn't have so many dimensions");
    }
    w = new Constant(type.width);
    t1 = new Arith(new Token('*'), i, w);
    loc = t1;
    // console.log('isisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisisisiisisis')
    while (this.look.tag == '[') {
      this.match('[');
      i = this.bool();
      this.match(']');
      try {
        type = type.of;
      } catch (e) {
        // console.log(e);
        error("this object doesn't have so many dimensions");
      }
      w = new Constant(this.type.width);
      t1 = new Arith(new Token('*'), i, w);
      t2 = new Arith(new Token('+'), loc, t1);
      loc = t2;
    }
    console.log('create access-------------------------------------------')
    console.log(type)
    return new Access(a, loc, type);
  }
}