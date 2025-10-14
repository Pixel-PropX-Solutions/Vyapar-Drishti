import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { getTodaydDateString } from '../../Utils/functionTools';

export type Account = {
    id: string,
    name: string
}

type ContextType = {

    account1: Account | null,
    setAccount1: Dispatch<SetStateAction<Account | null>>,

    account2: Account | null,
    setAccount2: Dispatch<SetStateAction<Account | null>>,

    date: string;
    setDate: Dispatch<SetStateAction<string>>;

    amount: string;
    setAmount: Dispatch<SetStateAction<string>>;

    voucherNo: string;
    setVoucherNo: Dispatch<SetStateAction<string>>;

    narration: string;
    setNarration: Dispatch<SetStateAction<string>>;

    progress: number;
    resetAll: () => void;
};

const fn = () => { };

const ContraContext = createContext<ContextType>({
    account1: null, setAccount1: fn,
    account2: null, setAccount2: fn,
    date: '',
    setDate: fn,
    amount: '', setAmount: fn,
    voucherNo: '',
    setVoucherNo: fn,
    narration: '',
    setNarration: fn,
    progress: 0,
    resetAll: fn,
});

export default function JournalContextProvider({ children }: { children: React.ReactNode }) {
    const [account1, setAccount1] = useState<Account | null>(null);
    const [account2, setAccount2] = useState<Account | null>(null);
    const [date, setDate] = useState<string>(getTodaydDateString());
    const [amount, setAmount] = useState<string>('');
    const [voucherNo, setVoucherNo] = useState<string>('AutoGen');
    const [narration, setNarration] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        let p = 0;
        if (voucherNo) { p++; }
        if (date) { p++; }
        if (amount) { p++; }
        if (account1 && account2) { p++; }
        setProgress(p / 4);
    }, [voucherNo, date, amount, account1, account2]);

    function resetAll() {
        setAccount1(null);
        setAccount2(null);
        setDate(getTodaydDateString());
        setVoucherNo('AutoGen');
        setNarration('');
        setProgress(0);
    }

    return (
        <ContraContext.Provider
            value={{ account1, setAccount1, account2, setAccount2, date, setDate, amount, setAmount, voucherNo, setVoucherNo, narration, setNarration, progress, resetAll }}
        >
            {children}
        </ContraContext.Provider>
    );
}

export function useContraContext() {
    return useContext(ContraContext);
}
