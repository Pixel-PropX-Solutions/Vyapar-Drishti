import { createContext,  ReactNode, useContext, useState } from 'react';
import { useUserStore } from '../../../../Store/ReduxStore';

type Filters = {
    sortBy: string,
    useAscOrder: boolean,
    status: 'all' | 'negative' | 'low' | 'positive',
    searchQuery: string
    category?: string,
    group?: string,
}

type ContextType = {
    isTaxEnable: boolean,
    filters: Filters, handleFilter: <Key extends keyof Filters>(key: Key, val: Filters[Key]) => void,
    resetFilters: () => void,
}


const fn = () => { };
const Context = createContext<ContextType>({
    isTaxEnable: false,
    filters: { sortBy: 'created_at', useAscOrder: false, status: 'all', searchQuery: '', category: 'All', group: 'All' }, handleFilter: fn,
    resetFilters: fn,
});


export default function ProductContextProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const { user } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const tax_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_tax;


    const [filters, setFilters] = useState<Filters>({ sortBy: 'created_at', useAscOrder: false, status: 'all', searchQuery: '', category: 'All', group: 'All' });

    function handleFilter<Key extends keyof Filters>(key: Key, val: Filters[Key]) {
        setFilters(pre => ({
            ...pre, [key]: val,
        }));
    }

    function resetFilters() {
        setFilters({ sortBy: 'created_at', useAscOrder: false, status: 'all', searchQuery: '', category: 'All', group: 'All' });
    }

    const states = {
        isTaxEnable: tax_enable,
        filters, handleFilter, resetFilters,
    };

    return <Context.Provider value={states} children={children} />;
}


export function useProductContext() {
    return useContext(Context);
}
