import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { useUserStore } from "../../../../Store/ReduxStore";

type Date = {year: number, month: number}

type ContextType = {
    date: Date, setDate: Dispatch<SetStateAction<Date>>,
    isGstEnable: boolean
}


const fn = () => {}
const Context = createContext<ContextType>({
    date: {year: 0, month: 0}, setDate: fn,
    isGstEnable: false
})


export default function BillContextProvider({children}: {children: ReactNode}): React.JSX.Element {

    const { user } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_gst;
    

    const [date, setDate] = useState<Date>({year: new Date().getFullYear(), month: new Date().getMonth()});

    const states = {
        date, setDate,
        isGstEnable: gst_enable
    }

    return <Context.Provider value={states} children={children} />
}


export function useBillContext(){
    return useContext(Context)
}