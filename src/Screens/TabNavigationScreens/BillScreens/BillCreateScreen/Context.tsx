import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';


type Product = {
    id: string,
    price: number,
    quantity: number,
    name: string,
    hsnCode: string,
    unit: string,
    gstRate: string
}

type Customer = {
    id: string,
    name: string,
    group: string
}

type ContextType = {
    products: Product[],
    setProducts: Dispatch<SetStateAction<Product[]>>

    customer: Customer | null,
    setCustomer: Dispatch<SetStateAction<Customer | null>>,

    totalValue: number,

    billNo: string,
    setBillNo: Dispatch<SetStateAction<string>>,

    createOn: string,
    setCreateOn: Dispatch<SetStateAction<string>>,

    progress: number,

    resetAllStates: () => void
}


const fn = () => {};

const Context = createContext<ContextType>({
    products: [], setProducts: fn,
    customer: null, setCustomer: fn,
    totalValue: 0,
    billNo: '', setBillNo: fn,
    createOn: '', setCreateOn: fn,
    resetAllStates: fn,
    progress: 0
});



export default function BillContextProvider({children}: {children: React.ReactNode}){

    const [products, setProducts] = useState<Product[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [billNo, setBillNo] = useState<string>('INV-000');
    const [createOn, setCreateOn] = useState<string>(new Date().toLocaleDateString());
    const [progress, setProgress] = useState<number>(0)
    
    function resetAllStates(): void {
        setProducts([]); setCreateOn(new Date().toLocaleDateString());
        setCustomer(null); setTotalValue(0);
    }

    const states = {
        products, setProducts,
        customer, setCustomer,
        totalValue,
        billNo, setBillNo,
        createOn, setCreateOn,
        resetAllStates,
        progress
    };

    useEffect(() => {
        setTotalValue(() => products.reduce((acc, pro) => acc + (pro.price * pro.quantity), 0));
    }, [products]);

    useEffect(() => {
        let time = new Date();
        let year = time.getFullYear().toString().slice(2);
        let no = time.getMonth() * 30 + time.getDate() * 7 + time.getDay() * 24 + time.getHours() * 60 + time.getMinutes() * 60 + time.getSeconds();
        setBillNo(`INV-${year}${no}`);
        setCreateOn(`${time.getDate()}/${(time.getMonth() + 1).toString().padStart(2, '0')}/${time.getFullYear()}`)
    }, []);

    useEffect(() => {
        let pro = 0;
        if(billNo) pro++;
        if(createOn) pro++;
        if(products.length > 0) pro++
        if(customer?.id) pro++;

        setProgress(pro / 4);
    }, [billNo, createOn, products, customer])
 

    return <Context.Provider children={children} value={states} />;
}


export function useBillContext(){
    return useContext(Context);
}
