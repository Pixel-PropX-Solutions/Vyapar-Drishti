import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import { useInvoiceStore } from '../../../../Store/ReduxStore';
import { getTodaydDateString } from '../../../../Utils/functionTools';


export type Product = {
    entry_id: string,
    item: string,
    item_id: string,
    unit: string,
    hsn_code: string,
    quantity: number,
    rate: number,
    amount: number,
    discount_amount: number,
    tax_rate: number,
    tax_amount: number,
    total_amount: number
}

type Customer = {
    entry_id: string,
    id: string,
    name: string,
    group: string
}

type AdditionalDetails = {
    dueDate: string,
    payAmount: number,
    transportMode: string,
    vechicleNumber: string,
    note: string
    additional_charge: number,
}

type HandleAdditionalDetails = <Field extends keyof AdditionalDetails>(field: Field, val: AdditionalDetails[Field]) => void;

const additionalDetailsDefaultValue: AdditionalDetails = {
    dueDate: (new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).toLocaleDateString(),
    payAmount: 0,
    transportMode: '',
    vechicleNumber: '',
    additional_charge: 0,
    note: '',
};

type ContextType = {
    products: Product[],
    setProducts: Dispatch<SetStateAction<Product[]>>

    customer: Customer | null,
    setCustomer: Dispatch<SetStateAction<Customer | null>>,

    total: number,
    discount: number,
    total_amount: number,
    total_tax: number,

    roundoff: number,
    grandTotal: number,

    billNo: string,
    setBillNo: Dispatch<SetStateAction<string>>,

    createOn: string,
    setCreateOn: Dispatch<SetStateAction<string>>,

    additionalDetails: AdditionalDetails,
    handleAdditionalDetails: HandleAdditionalDetails

    progress: number,

    resetAllStates: () => void
}


const fn = () => { };

const Context = createContext<ContextType>({
    products: [], setProducts: fn,
    customer: null, setCustomer: fn,
    total: 0,
    discount: 0,
    total_amount: 0,
    total_tax: 0,
    roundoff: 0,
    grandTotal: 0,
    billNo: '', setBillNo: fn,
    createOn: '', setCreateOn: fn,
    resetAllStates: fn,
    progress: 0,
    additionalDetails: additionalDetailsDefaultValue,
    handleAdditionalDetails: fn,
});



export default function BillContextProvider({ children }: { children: React.ReactNode }) {
    const { invoiceData } = useInvoiceStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [total, setTotal] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [total_amount, setTotalAmount] = useState<number>(0);
    const [total_tax, setTotalTax] = useState<number>(0);
    const [roundoff, setRoundoff] = useState<number>(0);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [billNo, setBillNo] = useState<string>('INV-000');
    const [createOn, setCreateOn] = useState<string>(getTodaydDateString());
    const [progress, setProgress] = useState<number>(0);
    const [additionalDetails, setAdditionalDetails] = useState<AdditionalDetails>(additionalDetailsDefaultValue);

    const handleAdditionalDetails: HandleAdditionalDetails = (field, val) => {
        setAdditionalDetails(pre => ({
            ...pre, [field]: val,
        }));
    };

    function resetAllStates(): void {
        setProducts([]); setCreateOn(getTodaydDateString());
        setCustomer(null); setTotal(0);
        setDiscount(0); setTotalAmount(0);
        setTotalTax(0);
        setRoundoff(0); setGrandTotal(0);
        setAdditionalDetails(additionalDetailsDefaultValue);
    }

    const states = {
        products, setProducts,
        customer, setCustomer,
        total, setTotal,
        discount, setDiscount,
        total_amount, setTotalAmount,
        total_tax, setTotalTax,
        roundoff, setRoundoff,
        grandTotal, setGrandTotal,
        billNo, setBillNo,
        createOn, setCreateOn,
        resetAllStates,
        progress, setProgress,
        additionalDetails, handleAdditionalDetails,
    };

    useEffect(() => {
        const total1 = products.reduce((acc, pro) => acc + pro.amount, 0);
        const discount1 = products.reduce((acc, pro) => acc + pro.discount_amount, 0);
        const total_tax1 = products.reduce((acc, pro) => acc + pro.tax_amount, 0);
        const total_amount1 = products.reduce((acc, pro) => acc + pro.total_amount, 0);
        const roundOff1 = Math.round(total_amount1 + additionalDetails.additional_charge) - (total_amount1 + additionalDetails.additional_charge);
        setTotal(() => total1);
        setTotalAmount(() => total_amount1);
        setDiscount(() => discount1);
        setTotalTax(() => total_tax1);
        setRoundoff(() => roundOff1);
        setGrandTotal(() => total_amount1 + additionalDetails.additional_charge + roundOff1);
    }, [products, additionalDetails.additional_charge]);


    useEffect(() => {
        let pro = 0;
        if (billNo) { pro++; }
        if (createOn) { pro++; }
        if (products.length > 0) { pro++; }
        if (customer?.id) { pro++; }

        setProgress(pro / 4);
    }, [billNo, createOn, products, customer]);

    useEffect(() => {
        setBillNo(invoiceData?.voucher_number ?? '');
        setCreateOn(invoiceData?.date.split('-').reverse().join('/') ?? '');
        setCustomer({
            entry_id: invoiceData?.accounting_entries.find(entry => entry.ledger_id === invoiceData.party_name_id)?._id ?? '',
            id: invoiceData?.party_name_id ?? '',
            name: invoiceData?.party_name ?? '',
            group: invoiceData?.party_details.parent ?? '',
        });
        setProducts(invoiceData?.inventory.map(itm => ({
            entry_id: itm._id,
            item: itm.item,
            quantity: itm.quantity,
            unit: itm.unit,
            hsn_code: itm.hsn_code,
            item_id: itm.item_id,
            rate: itm.rate,
            amount: itm.amount,
            discount_amount: itm.discount_amount,
            tax_rate: itm.tax_rate,
            tax_amount: itm.tax_amount,
            total_amount: itm.total_amount,
        })) ?? []);
        handleAdditionalDetails('dueDate', invoiceData?.due_date ?? '');
        handleAdditionalDetails('payAmount', invoiceData?.paid_amount ?? 0);
        handleAdditionalDetails('transportMode', invoiceData?.mode_of_transport ?? '');
        handleAdditionalDetails('vechicleNumber', invoiceData?.vehicle_number ?? '');
        handleAdditionalDetails('additional_charge', invoiceData?.additional_charge ?? 0);
        handleAdditionalDetails('note', invoiceData?.narration ?? '');
        setDiscount(invoiceData?.discount ?? 0);
        setTotal(invoiceData?.total ?? 0);
        setTotalAmount(invoiceData?.total_amount ?? 0);
        setTotalTax(invoiceData?.total_tax ?? 0);
        setRoundoff(invoiceData?.roundoff ?? 0);
        setGrandTotal(invoiceData?.grand_total ?? 0);
    }, [invoiceData?.accounting_entries, invoiceData?.additional_charge, invoiceData?.date, invoiceData?.discount, invoiceData?.due_date, invoiceData?.grand_total, invoiceData?.inventory, invoiceData?.mode_of_transport, invoiceData?.narration, invoiceData?.paid_amount, invoiceData?.party_details.parent, invoiceData?.party_name, invoiceData?.party_name_id, invoiceData?.roundoff, invoiceData?.total, invoiceData?.total_amount, invoiceData?.total_tax, invoiceData?.vehicle_number, invoiceData?.voucher_number]);

    return <Context.Provider children={children} value={states} />;
}


export function useBillContext() {
    return useContext(Context);
}



