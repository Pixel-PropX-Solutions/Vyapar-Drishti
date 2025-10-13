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

export const formatLocalDate = (date: Date): string => {
    const pad = (n: number): string => n.toString().padStart(2, '0');
    return (
        date.getFullYear() +
        '-' +
        pad(date.getMonth() + 1) +
        '-' +
        pad(date.getDate()) +
        'T' +
        pad(date.getHours()) +
        ':' +
        pad(date.getMinutes()) +
        ':' +
        pad(date.getSeconds()) +
        '.000Z'
    );
};

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
    if (num === undefined || num === null || isNaN(Number(num))) {
        return '0.00'; // Prevents crash on undefined/null/NaN
    }
    if (toFix === undefined || toFix === null || isNaN(Number(toFix))) { toFix = 2; } // Ensure toFix is non-negative
    if (minLen === undefined || minLen === null || isNaN(Number(minLen))) { minLen = 4; } // Ensure minLen is non-negative
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

export function roundToDecimal(num: number, decimalPlaces?: number): number {
    if (decimalPlaces === undefined || decimalPlaces === null || isNaN(Number(decimalPlaces))) {
        decimalPlaces = 2;
    }
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
    const form = new FormData();
    for (let [key, val] of arr) {
        let value = typeof val === 'boolean' ? val ? 'true' : 'false' : val || '';
        form.append(key, value ?? '');
    }
    return form;
}


export function isVersionLower(current: string, target: string) {
    const cur = current.split('.').map(Number);
    const tgt = target.split('.').map(Number);
    for (let i = 0; i < tgt.length; i++) {
        if ((cur[i] ?? 0) < (tgt[i] ?? 0)) { return true; }
        if ((cur[i] ?? 0) > (tgt[i] ?? 0)) { return false; }
    }
    return false;
}

export const getInitials = (name: string): string => {
    if (!name) { return ''; }
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

export const getFormattedName = (name: string): string => {
    // Returns the name in sentences case where the first letter of each word is capitalized.
    if (!name) { return ''; }
    return name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidMobileNumber(num: string): boolean {
    for (let char of num) {
        if (!'0123456789'.includes(char)) { return false; }
    }
    return true;
}


export function compareDates(date1: [number, number, number], date2?: [number, number, number]): -1 | 0 | 1 {
    if (!date2) {
        const time = new Date();
        date2 = [time.getDate(), time.getMonth(), time.getFullYear()];
    }

    const [d1, m1, y1] = date1, [d2, m2, y2] = date2;

    if (y1 < y2) { return -1; }
    if (y1 > y2) { return 1; }

    if (m1 < m2) { return -1; }
    if (m1 > m2) { return 1; }

    if (d1 < d2) { return -1; }
    if (d1 > d2) { return 1; }

    return 0;
}


export const getTodaydDateString = () => {
    let time = new Date();
    return `${time.getDate().toString().padStart(2, '0')}/${(time.getMonth() + 1).toString().padStart(2, '0')}/${time.getFullYear()}`;
};

type VoucherType =
    | 'Sales'
    | 'Purchase'
    | 'Payment'
    | 'Receipt'
    | 'Contra';

interface AccountingEntry {
    vouchar_id: string;
    ledger: string;
    ledger_id: string;
    amount: number;
}

interface GenerateAccountingParams {
    type: VoucherType;
    party: { name: string; id: string };
    counter: { name: string; id: string };
    amount: number;
}

/**
 * Generates accounting entries (Debit/Credit) for a given voucher type.
 */
export function generateAccounting({
    type,
    party,
    counter,
    amount,
}: GenerateAccountingParams): AccountingEntry[] {
    let partyAmount = 0;
    let counterAmount = 0;

    switch (type) {
        case 'Sales':
            partyAmount = +amount;
            counterAmount = -amount;
            break;

        case 'Purchase':
            partyAmount = -amount;
            counterAmount = +amount;
            break;
    }

    return [
        {
            vouchar_id: '',
            ledger: party.name,
            ledger_id: party.id,
            amount: partyAmount,
        },
        {
            vouchar_id: '',
            ledger: counter.name,
            ledger_id: counter.id,
            amount: counterAmount,
        },
    ];
}
