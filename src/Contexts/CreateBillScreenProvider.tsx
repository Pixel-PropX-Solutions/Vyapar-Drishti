import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";


type Product = {
    id: string,
    price: number,
    quantity: number,
    name: string,
    productNo: string,
    unit: string
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
    setCreateOn: Dispatch<SetStateAction<string>>
}


const fn = () => {}

const Context = createContext<ContextType>({
    products: [], setProducts: fn,
    customer: null, setCustomer: fn,
    totalValue: 0,
    billNo: '', setBillNo: fn,
    createOn: '', setCreateOn: fn
})



export default function CreateBillScreenProvider({children}: {children: React.ReactNode}){

    const [products, setProducts] = useState<Product[]>([]);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [totalValue, setTotalValue] = useState<number>(0);
    const [billNo, setBillNo] = useState<string>('#INV-2025-000');
    const [createOn, setCreateOn] = useState<string>(new Date().toLocaleDateString());


    useEffect(() => {
        setTotalValue(() => products.reduce((acc, pro) => acc + (pro.price * pro.quantity), 0));
    }, [products]);

    // useEffect(() => {
    //     let time = new Date();
    //     let year = time.getFullYear();
    //     let no = time.getMonth()*30 + time.getDate()*7 + time.getDay()*24 + time.getHours()*60 + time.getMinutes()*60 + time.getSeconds();
    //     setBillNo(`#INV-${year}-${no}`); 
    // }, []);

    const states = {
        products, setProducts,
        customer, setCustomer,
        totalValue,
        billNo, setBillNo,
        createOn, setCreateOn
    }

    return <Context.Provider children={children} value={states} />
}


export function useCreateBillContext(){
    return useContext(Context);
}