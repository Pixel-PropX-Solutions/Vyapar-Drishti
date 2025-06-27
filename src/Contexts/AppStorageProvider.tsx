import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { MMKV } from "react-native-mmkv";

type AppStorageContextType = {
    currency: string,
    setCurrency: Dispatch<SetStateAction<string>>,

    billPrefix: string,
    setBillPrefix: Dispatch<SetStateAction<string>>
}


const AppStorageContext = createContext<AppStorageContextType>({
    currency: 'INR', setCurrency: () => {},
    billPrefix: '#', setBillPrefix: () => {}
})

const storage = new MMKV({id: 'app-settings'});


export default function AppStorageProvider({children}: {children: React.ReactNode}) {

    const [currency, setCurrency] = useState<string>(storage.getString('currency') ?? 'INR');
    const [billPrefix, setBillPrefix] = useState<string>(storage.getString('bill-prefix') ?? '#');

    const states = {
        currency, setCurrency,
        billPrefix, setBillPrefix
    }

    useEffect(() => {
        storage.set('bill-prefix', billPrefix);
    }, [billPrefix, currency])

    useEffect(() => {
        storage.set('curency', currency);
    }, [currency])

    return <AppStorageContext.Provider value={states} >
        {children}
    </AppStorageContext.Provider>
}


export function useAppStorage(){
    return useContext(AppStorageContext);
}