import { useEffect, useState } from 'react';
import { useBillContext } from './Context';
import { roundToDecimal } from '../../../../Utils/functionTools';

type Product = {
    // vouchar_id: string,
    item: string, item_id: string, unit: string, hsn_code: string, quantity: number, rate: number, amount: number, discount_amount: number, tax_rate: number, tax_amount: number, total_amount: number
}

const productDefaultValue: Product = { item: '', item_id: '', unit: '', hsn_code: '', quantity: 0, rate: 0, amount: 0, discount_amount: 0, tax_rate: 0, tax_amount: 0, total_amount: 0 };


type HandleData = <Key extends keyof Product>(key: Key, val: Product[Key]) => void;

type ReturnType = {
    data: Product,
    handleData: HandleData,
    add: () => void,
    update: () => void
}

export function useProduct(index?: number, ...dipendency: any): ReturnType {

    const { products, setProducts } = useBillContext();
    const [data, setData] = useState<Product>(productDefaultValue);

    const handleData: HandleData = (key, val) => {
        setData(pre => ({
            ...pre, [key]: val,
        }));
    };

    function add() { setProducts(all => [...all, data]); }

    function update() {
        if (index === undefined) { return; }
        setProducts(pre => [
            ...pre.slice(0, index),
            data,
            ...pre.slice(index + 1),
        ]);
    }

    useEffect(() => {
        if (index === undefined || index < 0 || products.length <= index) {
            setData(productDefaultValue);
        } else {
            setData(products[index]);
        }
    }, [index, ...dipendency]);

    useEffect(() => {
        const quantity = Number(data.quantity);
        const rate = Number(data.rate);
        const discount = Number(data.discount_amount);
        const tax_rate = Number(data.tax_rate || 0);

        const amount = roundToDecimal((rate * quantity), 2);
        const discountedAmount = roundToDecimal((amount - discount), 2);
        const tax_amount = roundToDecimal((discountedAmount * tax_rate / 100) || 0, 2);
        const total_amount = roundToDecimal(discountedAmount + tax_amount);

        setData(pre => ({
            ...pre,
            amount, tax_amount, total_amount,
        }));

    }, [data.quantity, data.rate, data.discount_amount, data.tax_rate]);

    return { data, handleData, add, update };
}
