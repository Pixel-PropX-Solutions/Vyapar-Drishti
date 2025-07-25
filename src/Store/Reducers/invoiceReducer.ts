import { createSlice } from '@reduxjs/toolkit';
import { AuthStates } from '../../Utils/enums';
import { GetAllVouchars, GetInvoiceData, PageMeta } from '../../Utils/types';
import { createInvoice, viewAllInvoices, viewInvoice } from '../../Services/invoice';

interface InvoiceState {
    authState: AuthStates;
    invoices: Array<GetAllVouchars> | [];
    invoiceData: GetInvoiceData | null;
    pageMeta: PageMeta;
    loading: boolean;
    error: string | null;
    isInvoiceFeaching: boolean;
}

const initialState: InvoiceState = {
    authState: AuthStates.INITIALIZING,
    invoices: [],
    invoiceData: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null,
    isInvoiceFeaching: false,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            .addCase(viewAllInvoices.pending, (state) => {
                state.error = null;
                state.isInvoiceFeaching = true;
                if(state.invoices?.length ?? 0 < 10) 
                    state.invoices = [];
            })
            .addCase(viewAllInvoices.fulfilled, (state, { payload }: { payload: { invoices: GetAllVouchars[], pageMeta: PageMeta } | any }) => {
                state.pageMeta = payload.pageMeta;
                state.isInvoiceFeaching = false;
                if (payload.pageMeta.page === 1) {
                    state.invoices = payload.invoices;
                } else {
                    state.invoices = [...(state.invoices ?? []), ...(payload.invoices ?? [])];
                }
            })
            .addCase(viewAllInvoices.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isInvoiceFeaching = false;
            })

            .addCase(viewInvoice.pending, (state) => {
                state.error = null;
                state.isInvoiceFeaching = true;
            })
            .addCase(viewInvoice.fulfilled, (state, { payload }: { payload: { invoiceData: GetInvoiceData } | any }) => {
                state.invoiceData = payload.invoiceData;
                state.isInvoiceFeaching = false;
            })
            .addCase(viewInvoice.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isInvoiceFeaching = false;
            })

            .addCase(createInvoice.pending, (state) => {
                state.loading = true;
            })
            .addCase(createInvoice.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createInvoice.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload as string;
            });
    },
});


const invoiceReducer = invoiceSlice.reducer;
export default invoiceReducer;
