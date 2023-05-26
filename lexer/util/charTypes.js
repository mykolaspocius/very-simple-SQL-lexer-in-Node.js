export function isNumber (char){
    return  char >= '0' && char <= '9'
}

export function isAlpha(char){
    return  char >= 'A' && char <= 'Z' ||
            char >= 'a' && char <= 'z'
}