import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useUserStore } from '../../../../Store/ReduxStore';

type Date = { year: number, month: number }

type Filters = {
    sortBy: string,
    useAscOrder: boolean,
    status: 'all' | 'paid' | 'pending',
    billType: 'all' | 'Sales' | 'Purchase' | 'Payment' | 'Receipt' | 'Journal' | 'Contra',
    searchQuery: string,
    startDate?: string,
    endDate?: string,
}

const FilterDefaultValue: Filters = { searchQuery: '', sortBy: 'date', useAscOrder: false, status: 'all', billType: 'all', startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(), endDate: new Date().toISOString() };

type ContextType = {
    date: Date, setDate: Dispatch<SetStateAction<Date>>,
    isTaxEnable: boolean,
    filters: Filters, handleFilter: <Key extends keyof Filters>(key: Key, val: Filters[Key]) => void
}


const fn = () => { };
const Context = createContext<ContextType>({
    date: { year: 0, month: 0 }, setDate: fn,
    isTaxEnable: false,
    filters: FilterDefaultValue, handleFilter: fn,
});


export default function BillContextProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const { user, current_company_id } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === current_company_id);
    const tax_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_tax;


    const [date, setDate] = useState<Date>({ year: new Date().getFullYear(), month: new Date().getMonth() });
    const [filters, setFilters] = useState<Filters>(FilterDefaultValue);

    function handleFilter<Key extends keyof Filters>(key: Key, val: Filters[Key]) {
        setFilters(pre => ({
            ...pre, [key]: val,
        }));
    }

    const states = {
        date, setDate,
        isTaxEnable: tax_enable,
        filters, handleFilter,
    };

    return <Context.Provider value={states} children={children} />;
}


export function useBillContext() {
    return useContext(Context);
}
