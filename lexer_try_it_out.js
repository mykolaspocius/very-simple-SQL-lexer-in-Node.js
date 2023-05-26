import {Lexer} from './lexer/lexer.js'
import {Tokens} from './available_tokens.js'

let sql = "select people.id,name from people where id=1 and name='jorge' and price>=5.67 or (2+3)*4=20;"

let lexer = new Lexer (Tokens)
let tokens = lexer.processQuery (sql)
console.log (tokens)