
import {readFileSync} from 'fs'


export function getFileLines (file_path){
    let lines = []
    const allFileContents = readFileSync(file_path, 'utf-8')
    allFileContents.split(/\r?\n/).forEach(line =>  {lines.push (line)})
    return lines
}