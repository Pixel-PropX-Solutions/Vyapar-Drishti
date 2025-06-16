export default function arrayToFormData(arr: [key: string, val: string | boolean][]): FormData {
    const form = new FormData;
    for(let [key, val] of arr){
        let value = typeof val === 'boolean' ? val ? 'true' : 'false' : val || ''
        form.append(key, value ?? '');
    }
    return form;
}