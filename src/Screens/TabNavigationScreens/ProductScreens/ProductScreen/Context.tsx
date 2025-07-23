import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";

type Date = {year: number, month: number}

type ContextType = {
    date: Date, setDate: Dispatch<SetStateAction<Date>>
}


const fn = () => {}
const Context = createContext<ContextType>({
    date: {year: 0, month: 0}, setDate: fn
})

export default function ContextProvider({children}: {children: ReactNode}): React.JSX.Element {

    const [date, setDate] = useState<Date>({year: new Date().getFullYear(), month: new Date().getMonth()});

    const states = {
        date, setDate
    }

    return <Context.Provider value={states} children={children} />
}


export function useProductListingContext(){
    return useContext(Context)
}