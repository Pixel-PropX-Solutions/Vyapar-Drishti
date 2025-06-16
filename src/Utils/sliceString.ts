export default function sliceString(str: any, len: number, rem=2): string | undefined {
    if(typeof str !== 'string') return str;

    if(str.length <= len) return str;

    return str?.slice(0, len-rem) + '...'
}