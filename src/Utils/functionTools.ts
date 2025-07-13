export function stringToNumber(str: string, pre = 2, originalType = true) {
    let num = '';
    let decimal = '';
    let numbers = '0123456789';

    let index = 0;
    while (index < str.length && numbers.includes(str[index])) {
        num += str[index];
        index++;
    }

    if (index < str.length && str[index] !== '.') {return originalType ? parseInt(num) : Number(num + '.' + createString(pre, '0'));}

    index++;

    while (index < str.length && decimal.length <= pre && numbers.includes(str[index])) {
        decimal += str[index];
        index++;
    }

    let numberString = num + '.' + (decimal + createString(pre, '0')).slice(0, pre + 1);

    return Number(numberString);
}


export function createString(len: number, char = ' ') {
    let str = '';
    for (let i = 0; i < len; i++) {str += char;}
    return str;
}


export function sliceString(str: any, len = Infinity, rem = 2): string | undefined {
    if (typeof str !== 'string') {return str;}

    if (str.length <= len) {return str;}

    return str?.slice(0, len - rem) + '...';
}

// Helper to get 1st April of current year
export const getDefaultAprilFirst = () => {
    const now = new Date();
    const year = now.getFullYear();
    return new Date(year, 3, 1); // Month is 0-indexed, so 3 = April
};


export const capitalize = (str: string, by: 'word' | 'sentence' = "sentence"): string => {
    if(!str) return str;
    
    const splitBy = by === 'word' ? ' ' : '.';

    return str.split(splitBy).map(chars => chars.trim()).map(chars => (
        chars[0].toUpperCase() + chars.slice(1)
    )).join(splitBy + ' ');
}