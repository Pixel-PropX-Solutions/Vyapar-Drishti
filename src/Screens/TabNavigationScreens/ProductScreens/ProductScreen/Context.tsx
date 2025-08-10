import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { useUserStore } from '../../../../Store/ReduxStore';

type Filters = {
    sortBy: string,
    useAscOrder: boolean,
    status: 'all' | 'negative' | 'low' | 'positive',
    searchQuery: string
}

type ContextType = {
    isGstEnable: boolean,
    filters: Filters, handleFilter: <Key extends keyof Filters>(key: Key, val: Filters[Key]) => void
}


const fn = () => { };
const Context = createContext<ContextType>({
    isGstEnable: false,
    filters: { sortBy: '', useAscOrder: false, status: 'all', searchQuery: '' }, handleFilter: fn,
});


export default function ProductContextProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const { user } = useUserStore();
    const currentCompnayDetails = user?.company.find((c: any) => c._id === user?.user_settings?.current_company_id);
    const gst_enable: boolean = currentCompnayDetails?.company_settings?.features?.enable_gst;


    const [filters, setFilters] = useState<Filters>({ sortBy: 'Default', useAscOrder: false, status: 'all', searchQuery: ''});

    function handleFilter<Key extends keyof Filters>(key: Key, val: Filters[Key]) {
        setFilters(pre => ({
            ...pre, [key]: val,
        }));
    }

    const states = {
        isGstEnable: gst_enable,
        filters, handleFilter,
    };

    return <Context.Provider value={states} children={children} />;
}


export function useProductContext() {
    return useContext(Context);
}
