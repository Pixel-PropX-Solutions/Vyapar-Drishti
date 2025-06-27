import { MMKV } from "react-native-mmkv";

const AppSettingStore = new MMKV({id: 'app-settings'});

export default AppSettingStore;



export const setCurrency = (val: string): void =>  AppSettingStore.set('currency', val);

export function getCurrency(): string {
    if(AppSettingStore.contains('currency'))
        return AppSettingStore.getString('currency') ?? '';

    AppSettingStore.set('currency', 'INR');
    return 'INR';
}



export const setBillPrefix = (val: string): void => AppSettingStore.set('bill-prefix', val);

export function getBillPrefix(): string{
    if(AppSettingStore.contains('bill-prefix'))
        return AppSettingStore.getString('bill-prefix') ?? ''
    
    AppSettingStore.set('bill-prefix', '#');
    return '#'
}