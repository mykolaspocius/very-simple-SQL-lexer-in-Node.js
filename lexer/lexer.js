import {TokenTmatcherFactory} from './elements.js'

class Lexer{
    constructor (token_types,verbouse=false){
        this.tt_matchers = []
        if (verbouse)
            console.log ("creating type matchers...")
        for (let token_type of token_types){
            this.tt_matchers.push (TokenTmatcherFactory.getMatcherFor (token_type,verbouse))
        }
    }

    processQuery (sql_query){
        //replace all more then 1 consecutive white spaces to just one and trim
        const query = sql_query.replace(/\s+/g, ' ').trim()
        //create an iterator to step trough the query string
        let queryIterator = this.createQueryIterator (query)
        //initialize an array to store tokens found
        let tokens_found = []
        //get the first letter from the string and setup pointers
        let result = queryIterator.next ()
        var cur_token_pos = 0
        let acceptingMatchers = []
        //main loop
        while (!result.done){
            //holds the character at current position
            let char = result.value
            //pass the character together with current pos in token to all the matchers
            this.feedCharToMatchers (char,cur_token_pos)
            //get read of matchers that are in error state
            let activeMatchers = this.filterErrorStateMatchers ()
            //if there are matchers to procede, save the ones that have accepted and continue
            if (activeMatchers.length > 0){
                acceptingMatchers = this.getAcceptingMatchers (activeMatchers)
                cur_token_pos++
            } else{
                //if no active neither accepting matchers left, means there is a character that is not recognized by a grammar
                //spit error message and return tokens found till now
                if (acceptingMatchers.length == 0){
                    console.log (`syntax error: unexpected character '${char}' at position: ${queryIterator.getCurrentIndex ()}`)
                    return tokens_found
                }
                //if no active matchers left, but some matchers have accepted pervious character
                //find the matcher with hieghest priority
                let selected_matcher = this.getPriorityMatcher (acceptingMatchers) 
                //make matcher emit token and save it in tokens found
                tokens_found.push (selected_matcher.emitToken (queryIterator.getCurrentIndex () - selected_matcher.stack.length))
                //if current char is not a white space and since no matchers could digest it, 
                //it means it has to belong to first char in some next token
                //so step back in iterator and reset all the matchers and pointers
                if (char != ' ')
                    queryIterator.stepBack ()
                this.resetMatchers ()
                acceptingMatchers = []
                cur_token_pos = 0
            }
            //go get next char
            result = queryIterator.next ()
        }
        return tokens_found
    }

    feedCharToMatchers (char,pos){
        for (let matcher of this.tt_matchers){
            matcher.input (char,pos)
        }
    }

    filterErrorStateMatchers (){
        return this.tt_matchers.filter ((m) => !m.error_state)
    }

    getAcceptingMatchers (matchers){
        return matchers.filter ((m) => m.accept_state)
    }

    getPriorityMatcher (matchers){
        return matchers.reduce (
            (priorityMatcher,curMatcher) => curMatcher.token_type.priority < priorityMatcher.token_type.priority ? curMatcher : priorityMatcher, matchers[0])
    }

    resetMatchers (){
        for (let m of this.tt_matchers){
            m.reset()
        }
    }

    createQueryIterator (query){
        var nextIndex = 0
        var end = query.length
        return {
            "next" : function (){
                if (nextIndex < end){ 
                    let result = {
                        "value" : query[nextIndex],
                        "done" : false
                    }
                    ++nextIndex
                    return result
                }else{
                    return {
                        "value" : query[nextIndex-1],
                        "done" : true
                    }
                }
            },
            "stepBack" : function (){
                --nextIndex
            },
            "getCurrentIndex" : function (){
                return nextIndex - 1
            }
        }
    }
}

export {Lexer}