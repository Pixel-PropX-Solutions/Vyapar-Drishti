import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { getTodaydDateString } from '../../../../Utils/functionTools';


type Customer = {
    id: string,
    name: string,
    group: string
}

type Account = {
    id: string,
    name: string
}

type ContextType = {
    customer: Customer | null,
    setCustomer: Dispatch<SetStateAction<Customer | null>>,

    account: Account | null,
    setAccount: Dispatch<SetStateAction<Account | null>>,

    amount: string,
    setAmount: Dispatch<SetStateAction<string>>,

    transactionNo: string,
    setTransactionNo: Dispatch<SetStateAction<string>>,

    createOn: string,
    setCreateOn: Dispatch<SetStateAction<string>>,

    note: string,
    setNote: Dispatch<SetStateAction<string>>,
    resetAllStates: () => void
    progress: number,

}

const fn = () => { };

const TransactionContext = createContext<ContextType>({
    customer: null, setCustomer: fn,
    account: null, setAccount: fn,
    amount: '', setAmount: fn,
    transactionNo: '', setTransactionNo: fn,
    createOn: '', setCreateOn: fn,
    note: '', setNote: fn,
    resetAllStates: fn,
    progress: 0,
});


export default function TransactionContextProvider({ children }: { children: React.ReactNode }) {

    const [customer, setCustomer] = useState<Customer | null>(null);
    const [account, setAccount] = useState<Account | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [transactionNo, setTransactionNo] = useState<string>('AutoGen');
    const [createOn, setCreateOn] = useState<string>(getTodaydDateString());
    const [note, setNote] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);


    function resetAllStates(): void {
        setCustomer(null);
        setAccount(null);
        setAmount('');
        setTransactionNo('AutoGen');
        setNote('');
        setCreateOn(getTodaydDateString());
    }


    const states = {
        customer, setCustomer,
        account, setAccount,
        amount, setAmount,
        transactionNo, setTransactionNo,
        createOn, setCreateOn,
        progress,
        setProgress,
        resetAllStates,
        note, setNote,
    };


    useEffect(() => {
        let progress = 0;
        if (transactionNo) { progress++; }
        if (createOn) { progress++; }
        if (amount) { progress++; }
        if (customer) { progress++; }
        if (account) { progress++; }

        setProgress(progress / 5);
    }, [transactionNo, createOn, customer, amount]);


    return (
        <TransactionContext.Provider value={states}>
            {children}
        </TransactionContext.Provider>
    );
}


export function useTransactionContext() {
    return useContext(TransactionContext);
}
