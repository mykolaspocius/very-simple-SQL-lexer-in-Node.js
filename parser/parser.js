
import {getFileLines} from './util/utils.js'


class Parser{
    constructor (gramma_file){
        this.rules = {}
        this.addRules (gramma_file)
    }

    addRules (gramma_file){
        let lines = getFileLines (gramma_file)
        for (const line of lines){
            let [lhs,rhs] = line.split (':=')
            this.rules[lhs.trim ()] = rhs.length > 0 ? rhs.split ('|').map(element => element.trim ()) : [];
        }
    }

    first (element,possible_first_token = new Set ()){
        if (!this.isNonterminal (element)){
            possible_first_token.add (element)
        }
        else{
            for (let production of this.rules[element]){
                let first_element_in_production = production.split (' ')[0]
                this.first (first_element_in_production,possible_first_token)
            }
        }
        return possible_first_token
    }

    isNonterminal (element){
        return element.charAt (0) == '<'
    }





    //depth-first traversal computing atributes when leaving node (postorder)
    visit (node){
        for (let child of node.children){
            this.visit (child)
        }
        node.executeSemanticRule ()
    }
}

export {Parser}