export function toCapital(str: string): string {
    if(!str) return '';
    
    return str.split('.')
        .map(s => s.trim())
        .map(s => s[0].toLocaleUpperCase() + s.slice(1))
        .join('. ');
}