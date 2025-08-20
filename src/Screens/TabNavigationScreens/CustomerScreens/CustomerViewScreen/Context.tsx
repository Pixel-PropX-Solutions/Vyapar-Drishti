import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useUserStore } from '../../../../Store/ReduxStore';

type Date = { year: number, month: number }

type Filters = {
    sortBy: string,
    useAscOrder: boolean,
    filterState: 'All-States',
    type: 'Customers' | 'Accounts',
    invoiceType: 'all' | 'Sales' | 'Purchase' | 'Payment' | 'Receipt',
    searchQuery: string
    startDate?: string,
    endDate?: string,
}

type ContextType = {
    date: Date, setDate: Dispatch<SetStateAction<Date>>,
    isGstEnable: boolean,
    filters: Filters, handleFilter: <Key extends keyof Filters>(key: Key, val: Filters[Key]) => void
}


const fn = () => { };
const defaultFiltersValue: Filters = { sortBy: '', useAscOrder: false, filterState: 'All-States', type: 'Customers', startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), endDate: new Date().toISOString(), invoiceType: 'all', searchQuery: ""}
const Context = createContext<ContextType>({
    date: { year: 0, month: 0 }, setDate: fn,
    isGstEnable: false,
    filters: defaultFiltersValue, handleFilter: fn,
});


export default function CustomerContextProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const { user, current_company_id } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === current_company_id);
    const gst_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_gst;


    const [date, setDate] = useState<Date>({ year: new Date().getFullYear(), month: new Date().getMonth() });
    const [filters, setFilters] = useState<Filters>(defaultFiltersValue);

    function handleFilter<Key extends keyof Filters>(key: Key, val: Filters[Key]) {
        setFilters(pre => ({
            ...pre, [key]: val,
        }));
    }

    const states = {
        date, setDate,
        isGstEnable: gst_enable,
        filters, handleFilter,
    };

    return <Context.Provider value={states} children={children} />;
}


export function useCustomerContext() {
    return useContext(Context);
}
