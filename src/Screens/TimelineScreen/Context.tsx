import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';

type Date = { year: number, month: number }

type Filter = {
    searchQuery: string,
    sortBy: string,
    useAscOrder: boolean,
    startDate?: string,
    endDate?: string,
    page_no?: number,
    limit?: number,
}

type HandleFilter = <Key extends keyof Filter>(key: Key, val: Filter[Key]) => void;

const defaultFilter: Filter = {
    searchQuery: '', sortBy: 'item', useAscOrder: true,
    page_no: 1, limit: 100000,
    startDate: new Date('2025-04-01').toISOString(), endDate: new Date('2026-03-31').toISOString(),
};


type ContextType = {
    filter: Filter,
    handleFilter: HandleFilter,
    date: Date, setDate: Dispatch<SetStateAction<Date>>,
}

const fn = () => { };
const Context = createContext<ContextType>({
    filter: defaultFilter, handleFilter: fn,
    date: { year: 0, month: 0 }, setDate: fn,
});


export default function TimelineContextProvider({ children }: { children: ReactNode }): React.JSX.Element {

    const [filter, setFilter] = useState<Filter>(defaultFilter);
    const [date, setDate] = useState<Date>({ year: new Date().getFullYear(), month: new Date().getMonth() });

    const handleFilter: HandleFilter = (key, val) => {
        setFilter(pre => ({
            ...pre, [key]: val,
        }));
    };


    const states = {
        filter, handleFilter,
        date, setDate,
    };

    return (
        <Context.Provider value={states} >
            {children}
        </Context.Provider>
    );
}



export function useTimelineContext() {
    return useContext(Context);
}
