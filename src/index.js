import {
  Lexer
} from '/src/lexer/Lexer'
import Parser from './parser/parser';
import {
  inputCode,
} from './tool/tool';


const code =
  `{
    {
      int i;int j; float v;float x;float[100] a;
      while(true){
        do i = i+1;while(a[i]<v);
        do j = j-1;while(a[j]>v);
        if(i>=j)break;
        x = a[i];a[i]=a[j];a[j]=x;
      }
    }
    {
      int                  
  
  
      a;
      a = 1;
    }
    {
      int  a, b, c;
      a = 1;
      b = 2;
      c= a  +
      b;
    }
    {
      int a;
      a = 1;
      int b,c;
      b = a;
      c= a+b;
    }
    {
      int a;
      a = 1
      ;{
        a = a +1;
        int a ;a
        = 3;
        a = a+1
  ;    }
      a = a+1;
    }
    {
      int a;
      a = 1+2*(4+10086);
    }
    {
      int a;
      a = 1*0.5;
    }
    {
      int a,b,c;
      if(a==0||b==0&&c==0){
        c = c+1;
      }
    }
    {
      int [10][10]a;
      a[1][1] = 3;
      a[a[1][1]][a[1][1]] = a[1][1]+5;
    }
    {
      int a;
      int[10][10] A;
      while(a<10){
        int c;
        c = 1;
        while(c<10){
          if((a+c)-(a+c)/2*2==0) continue;
          A[a][c]=a+c;
          c=c+1;
          if(a+c==19) break;
        }
        a=a+1;
      }
      int c;
      c = 1;
    }
    {
      int a;
      if(a==1){
        int b;
        b = b+1;
      }else{
        int c;
        c = c+1;
      }
    }
  }`

inputCode(code);
const lex = new Lexer();
const parse = new Parser(lex);
parse.program();