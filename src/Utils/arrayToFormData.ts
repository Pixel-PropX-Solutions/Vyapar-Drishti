export default function arrayToFormData(arr: [key: string, val: string | boolean][]): FormData {
    const form = new FormData;
    for(let [key, val] of arr){
        form.append(key, typeof val === 'boolean' ? val ? 'true' : 'false' : val);
    }
    return form;
}