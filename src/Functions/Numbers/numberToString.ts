export default function numberToString(num: number, pre: number=2): string {
    let str = String(num);
    
    if(!str.includes('.')) return str + '.' + ''.padEnd(pre, '0');
    
    let strArr = str.split('.');
    str = strArr[0] + '.' + str[1].slice(0, pre).padEnd(pre, '0');

    return str;
}