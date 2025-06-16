import { configureStore } from "@reduxjs/toolkit";
import companyReduser from "./Reducers/companyReduser";
import { useDispatch, useSelector } from "react-redux";

const ReduxStore = configureStore({
    reducer: {
        company: companyReduser
    }
})

export type RootState = ReturnType<typeof ReduxStore.getState>;
export type AppDispatch = typeof ReduxStore.dispatch;

export default ReduxStore;


export function useAppDispatch() {
    return useDispatch<AppDispatch>()
};

export function useCompanyStore(){
    return useSelector((state: RootState) => state.company);
}