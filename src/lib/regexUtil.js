// Returns numbers in the given string
export function getNumber (str) {
    let regex = /\d+/g;
    let x;
    x = str.match(regex);
    x = x || [];
    x = x.join('');

    return x;
}