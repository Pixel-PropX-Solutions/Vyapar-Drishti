import { configureStore } from "@reduxjs/toolkit";
import companyReduser from "./Redusers/companyReduser";
import { useDispatch, useSelector } from "react-redux";
import customerReduser from "./Redusers/customerReduser";
import userReducer from "./Redusers/userReduser";
import productReduser from "./Redusers/productReduser";

const ReduxStore = configureStore({
    reducer: {
        companyStore: companyReduser,
        customerStore: customerReduser,
        userStore: userReducer,
        productStore: productReduser
    }
})

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;


export function useAppDispatch() {
    return useDispatch<AppDispatch>()
};


export function useCompanyStore(){
    return useSelector((state: RootState) => state.companyStore);
}

export function useCustomerStore(){
    return useSelector((state: RootState) => state.customerStore);
}

export function useUserStore(){
    return useSelector((state: RootState) => state.userStore);
}

export function useProductStore(){
    return useSelector((state: RootState) => state.productStore);
}