import * as utils from './util/charTypes.js'

class Token{
    constructor (type,value,position){
        this.type = type
        this.value = value
        this.position = position
    }
}
/*
* Base class for all Token Types
* The descendant classes will override validChar method
*/
class TokenT{
    constructor (name, priority){
        this.name = name
        this.priority = priority
    }

    validChar (char, pos) {
        return true
    }
}

class ReservedT extends TokenT{
    constructor (name,value){
        super (name,0)
        this.value = value
        this.validChar = function (char, pos){
            return this.outOfRange (pos) ? false : this.value.charAt (pos) == char 
        }
    }

    outOfRange (pos){
         return pos >= this.value.length

    }

    isLast (pos){
        return pos == this.value.length -1
    }
}

class IdT extends TokenT{
    constructor (name){
        super (name,1)
        this.validChar = function (char, pos){
            if (pos == 0){
                return utils.isAlpha (char) || char == '_'
            }else{
                return utils.isNumber (char) || utils.isAlpha (char) || char == '_'
            }
        }
    }
}

class NumberT extends TokenT{
    constructor (name){
        super (name,2)
        this.validChar = function (char, pos){
            if (char == '.'){
                return pos != 0
            }else{
                return  utils.isNumber (char)
            }
        }
    }
}

class StringT extends TokenT{
    constructor (name){
        super (name,1)
        this.validChar = function (char, pos){
            if (pos == 0)
                return char == '\''
            return true
        }
    }
}

class TokenTmatcher{
    constructor (token_type){
        this.token_type = token_type
        this.stack = ""
        this.accept_state = false
        this.error_state = false
    }

    emitToken (position){
        if (this.token_type instanceof NumberT){
            return new Token (this.token_type.name,Number (this.stack),position)
        }else{
            return new Token (this.token_type.name,this.stack,position)
        }
    }

    reset (){
        this.stack = ""
        this.accept_state = false
        this.error_state = false
    }
}

class TokenTmatcherFactory{
    static getMatcherFor (token_type,verbouse=false){
        let matcher = new TokenTmatcher (token_type)
        if (token_type instanceof NumberT){
            if (verbouse) 
                this.log (token_type)
            matcher.input = function (char, pos){
                if (!this.token_type.validChar (char, pos) ||
                    (char == '.' && this.stack.indexOf ('.') > 0)){
                    this.error_state = true
                    this.accept_state = false
                    return
                }else{
                    matcher.stack += char
                    matcher.accept_state = true
                }
            }
        }else if (token_type instanceof ReservedT){
            if (verbouse) 
                this.log (token_type)
            matcher.input = function (char, pos){
                if (!this.token_type.validChar (char, pos)){
                    this.error_state = true
                    this.accept_state = false
                }else{
                    this.stack += char
                    if (this.token_type.isLast (pos))
                        this.accept_state = true
                }
            }
        }else if (token_type instanceof StringT){
            if (verbouse) 
                this.log (token_type)
                matcher.input = function (char, pos){
                    if (!this.accept_state){
                        if (token_type.validChar (char, pos)){
                            this.stack += char
                            if (char == '\'' && pos != 0){
                                this.accept_state = true
                            }
                            return
                        }
                    }
                    this.accept_state = false
                    this.error_state = true
                }
        }else if (token_type instanceof IdT){
            if (verbouse) 
                this.log (token_type)
            matcher.input = function (char, pos){
                if (!this.token_type.validChar (char, pos)){
                    this.error_state = true
                    this.accept_state = false
                }else{
                    this.stack += char
                    this.accept_state = true
                }
            }
        }
        return matcher
    }

    static log (token_type){
        console.log (`  making matcher for ${token_type.name}`)
    }
}

export {Token,ReservedT,IdT,NumberT,StringT,TokenTmatcherFactory}