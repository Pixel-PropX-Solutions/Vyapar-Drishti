export function stringToNumber(str: string, pre = 2, originalType = true) {
    let num = '';
    let decimal = '';
    let numbers = '0123456789';

    let index = 0;
    while (index < str.length && numbers.includes(str[index])) {
        num += str[index];
        index++;
    }

    if (index < str.length && str[index] !== '.') { return originalType ? parseInt(num) : Number(num + '.' + createString(pre, '0')); }

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
    for (let i = 0; i < len; i++) { str += char; }
    return str;
}


export function sliceString(str: any, len = Infinity, rem = 2): string | undefined {
    if (typeof str !== 'string') { return str; }

    if (str.length <= len) { return str; }

    return str?.slice(0, len - rem) + '...';
}

// Helper to get 1st April of current year
export const getDefaultAprilFirst = () => {
    const now = new Date();
    const year = now.getFullYear();
    return new Date(year, 3, 1); // Month is 0-indexed, so 3 = April
};


export const capitalize = (str: string, by: 'word' | 'sentence' = 'sentence'): string => {
    if (!str) { return str; }

    const splitBy = by === 'word' ? ' ' : '.';

    return str.split(splitBy).map(chars => chars.trim()).map(chars => (
        chars[0].toUpperCase() + chars.slice(1)
    )).join(splitBy + ' ');
};


export function formatNumberForUI(num: number, minLen = 4, toFix = 2): string {
    const absNum = Math.abs(num);

    let sign: string = num < 0 ? '-' : '';

    if (Math.floor(absNum).toString().length <= minLen) { return `${sign}${absNum.toFixed(toFix)}`; }

    if (Math.floor(absNum / 1_000).toString().length <= minLen) { return `${sign}${(absNum / 1_000).toFixed(toFix)}K`; }

    if (Math.floor(absNum / 100_000).toString().length <= minLen) { return `${sign}${(absNum / 100_000).toFixed(toFix)}M`; }

    if (Math.floor(absNum / 100_00_000).toString().length <= minLen) { return `${sign}${(absNum / 100_00_000).toFixed(toFix)}B`; }

    return `${sign}${(absNum / 100_00_000_000).toFixed(toFix)}T`;
}


export function getMonthByIndex(index: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[Math.abs(index) % 12];
}

export function roundToDecimal(num: number, decimalPlaces: number): number {
    // Rounds a number to a specified number of decimal places.
    const res = Number(num.toFixed(decimalPlaces));
    return res;
}

export const formatDatewithTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
};

// Format the date to a readable format
export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};


export function arrayToFormData(arr: [key: string, val: string | boolean][]): FormData {
    const form = new FormData;
    for(let [key, val] of arr){
        let value = typeof val === 'boolean' ? val ? 'true' : 'false' : val || ''
        form.append(key, value ?? '');
    }
    return form;
}


export function isVersionLower(current: string, target: string) {
  const cur = current.split('.').map(Number);
  const tgt = target.split('.').map(Number);
  for (let i = 0; i < tgt.length; i++) {
    if ((cur[i] ?? 0) < (tgt[i] ?? 0)) return true;
    if ((cur[i] ?? 0) > (tgt[i] ?? 0)) return false;
  }
  return false;
}
