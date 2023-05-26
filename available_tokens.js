import {ReservedT, IdT, NumberT, StringT} from './lexer/elements.js'

const separators = [
    new ReservedT ("semicol",";"),
    new ReservedT ("lp","("),
    new ReservedT ("rp",")"),
    new ReservedT ("coma",","),
    new ReservedT ("dot",".")
]

const constants = [
    new NumberT ("number"),
    new StringT ("string"),
    new ReservedT ("null","null"),
    new ReservedT ("false","false"),
    new ReservedT ("true","true")
]
const operators = [
    new ReservedT ("mul","*"),
    new ReservedT ("plus","+"),
    new ReservedT ("minus","-"),
    new ReservedT ("div","/"),
    new ReservedT ("mod","%"),
    new ReservedT ("and","and"),
    new ReservedT ("or","or"),
    new ReservedT ("equal","="),
    new ReservedT ("lt","<"),
    new ReservedT ("gt",">"),
    new ReservedT ("lte","<="),
    new ReservedT ("gte",">="),
    new ReservedT ("ne","<>")
]
const reservedWords = [
    new ReservedT ("select","select"),
    new ReservedT ("from","from"),
    new IdT ("identifier"),
    new ReservedT ("where","where")
]

const Tokens = reservedWords
                .concat (operators)
                .concat (constants)
                .concat (separators)

export {Tokens}