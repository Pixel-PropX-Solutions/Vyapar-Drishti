import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './Reducers/companyReducer';
import { useDispatch, useSelector } from 'react-redux';
import customerReducer from './Reducers/customerReducer';
import userReducer from './Reducers/userReducer';
import productReducer from './Reducers/productReducer';
import invoiceReducer from './Reducers/invoiceReducer';

const ReduxStore = configureStore({
    reducer: {
        companyStore: companyReducer,
        customerStore: customerReducer,
        userStore: userReducer,
        productStore: productReducer,
        invoiceStore: invoiceReducer,
    },
});

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;


export function useAppDispatch() {
    return useDispatch<AppDispatch>();
}


export function useCompanyStore() {
    return useSelector((state: RootState) => state.companyStore);
}

export function useCustomerStore() {
    return useSelector((state: RootState) => state.customerStore);
}

export function useUserStore() {
    return useSelector((state: RootState) => state.userStore);
}

export function useProductStore() {
    return useSelector((state: RootState) => state.productStore);
}

export function useInvoiceStore() {
    return useSelector((state: RootState) => state.invoiceStore);
}
