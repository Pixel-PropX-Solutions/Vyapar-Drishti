export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function isValidMobileNumber(num: string): boolean {
    for(let char of num) {
        if(!'0123456789'.includes(char)) 
            return false;
    }
    return true;
}