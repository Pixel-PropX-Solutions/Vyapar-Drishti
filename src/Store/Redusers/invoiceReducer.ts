import { createSlice } from "@reduxjs/toolkit";
import { AuthStates } from "../../Utils/enums";
import { GetAllVouchars, PageMeta } from "../../Utils/types";
import {  createInvoice, viewAllInvoices } from "../../Services/invoice";

interface InvoiceState {
    authState: AuthStates;
    invoices: Array<GetAllVouchars> | [];
    pageMeta: PageMeta;
    loading: boolean;
    error: string | null;
    isInvoiceFeaching: boolean;
}

const initialState: InvoiceState = {
    authState: AuthStates.INITIALIZING,
    invoices: [],
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null,
    isInvoiceFeaching: false
};

const invoiceSlice = createSlice({
    name: "invoice",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            .addCase(viewAllInvoices.pending, (state) => {
                state.error = null;
                state.isInvoiceFeaching = true;
            })
            .addCase(viewAllInvoices.fulfilled, (state, {payload}: {payload: {invoices: GetAllVouchars[], pageMeta: PageMeta} | any}) => {
                state.pageMeta = payload.pageMeta;
                state.isInvoiceFeaching = false;
                if(payload.pageMeta.page == 1){
                    state.invoices = payload.invoices;
                } else {
                    state.invoices = [...(state.invoices ?? []), ...(payload.invoices ?? [])]
                }
            })
            .addCase(viewAllInvoices.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isInvoiceFeaching = false;
            })

            .addCase(createInvoice.pending, (state) => {
                state.loading = true;
            })
            .addCase(createInvoice.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(createInvoice.rejected, (state, {payload}) => {
                state.loading = false
                state.error = payload as string
            })
    },
});


const invoiceReducer = invoiceSlice.reducer;
export default invoiceReducer;