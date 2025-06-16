import { MMKV } from "react-native-mmkv";

const AuthStore = new MMKV({id: 'auth-storage'});

export default AuthStore;