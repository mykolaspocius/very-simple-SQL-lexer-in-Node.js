
import {Lexer} from './lexer/lexer.js'
import {Tokens} from './available_tokens.js'
import {Parser} from './parser/parser.js'


let lexer = new Lexer (Tokens)
let sql = "select personas.id,name from personas where id=1 and name='mykolas' and price>=5.67 or (2+3)*4;"
let tokens = lexer.processQuery (sql)
console.log (tokens)
// let parser = new Parser ('./parser/rules.grm')
// console.log (parser.rules)
// console.log (parser.first ("<sql>"))







