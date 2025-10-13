import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from 'react';
import { getTodaydDateString } from '../../../../Utils/functionTools';

export type LedgerEntry = {
    id: string;
    name: string;
    type: 'To' | 'From';
    amount: string;
    note?: string;
};

type ContextType = {
    entries: LedgerEntry[];
    setEntries: Dispatch<SetStateAction<LedgerEntry[]>>;

    date: string;
    setDate: Dispatch<SetStateAction<string>>;

    voucherNo: string;
    setVoucherNo: Dispatch<SetStateAction<string>>;

    narration: string;
    setNarration: Dispatch<SetStateAction<string>>;

    paymentMode: string;
    setPaymentMode: Dispatch<SetStateAction<string>>;

    notes: string;
    setNotes: Dispatch<SetStateAction<string>>;

    progress: number;
    resetAll: () => void;
};

const fn = () => { };

const JournalContext = createContext<ContextType>({
    entries: [],
    setEntries: fn,
    date: '',
    setDate: fn,
    voucherNo: '',
    setVoucherNo: fn,
    narration: '',
    setNarration: fn,
    paymentMode: '',
    setPaymentMode: fn,
    notes: '',
    setNotes: fn,
    progress: 0,
    resetAll: fn,
});

export default function JournalContextProvider({ children }: { children: React.ReactNode }) {
    const [entries, setEntries] = useState<LedgerEntry[]>([]);
    const [date, setDate] = useState<string>(getTodaydDateString());
    const [voucherNo, setVoucherNo] = useState<string>('AutoGen');
    const [narration, setNarration] = useState<string>('');
    const [paymentMode, setPaymentMode] = useState<string>('By Cash');
    const [notes, setNotes] = useState<string>('');
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        let p = 0;
        if (voucherNo) { p++; }
        if (date) { p++; }
        if (entries.length >= 2) { p++; }
        setProgress(p / 3);
    }, [voucherNo, date, entries]);

    function resetAll() {
        setEntries([]);
        setDate(getTodaydDateString());
        setVoucherNo('AutoGen');
        setNarration('');
        setPaymentMode('By Cash');
        setNotes('');
        setProgress(0);
    }

    return (
        <JournalContext.Provider
            value={{ entries, setEntries, date, setDate, voucherNo, setVoucherNo, narration, setNarration, paymentMode, setPaymentMode, notes, setNotes, progress, resetAll }}
        >
            {children}
        </JournalContext.Provider>
    );
}

export function useJournalContext() {
    return useContext(JournalContext);
}
