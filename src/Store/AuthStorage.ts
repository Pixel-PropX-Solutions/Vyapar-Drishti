import { MMKV } from "react-native-mmkv";

const AuthStorage = new MMKV({id: 'auth-storage'});

// const AuthStorage = {
    
//     set: (key: string, val: string): void => {
//         storage.set(key, val)
//     },

//     delete: (key: string): void => {
//         storage.delete(key)
//     },
    
//     get: (key: string): string | undefined => storage.getString(key),
    
//     getAllKeys: (): string[] => storage.getAllKeys(),

//     has: (key: string): boolean => storage.contains(key)
// }

export default AuthStorage;