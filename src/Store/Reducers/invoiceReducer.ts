import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStates } from '../../Utils/enums';
import { GetAllVouchars, GetInvoiceData, PageMeta, TimelineData, TimeLinePageMeta } from '../../Utils/types';
import { createInvoice, getAllInvoiceGroups, getTimeline, viewAllInvoices, viewInvoice } from '../../Services/invoice';

interface InvoiceState {
    authState: AuthStates;
    invoices: Array<GetAllVouchars> | [];
    invoiceData: GetInvoiceData | null;
    pageMeta: PageMeta;
    loading: boolean;
    error: string | null;
    isInvoiceFeaching: boolean;
    invoiceGroups: Array<{
        _id: string;
        name: string;
    }>;
    timelineData: Array<TimelineData> | [];
    timelinePageMeta: TimeLinePageMeta;
    isTimelineFetching: boolean;
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
    invoiceGroups: [],
    timelineData: [],
    isTimelineFetching: false,
    timelinePageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        opening_val: 0,
        inwards_val: 0,
        outwards_val: 0,
        closing_val: 0,
        gross_profit: 0,
        profit_percent: 0,
    },
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        setInvoice(state, { payload }) {
            state.invoices = payload;
        },
    },
    extraReducers: (builder) => {
        builder

            .addCase(viewAllInvoices.pending, (state) => {
                state.error = null;
                state.isInvoiceFeaching = true;
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

            .addCase(getTimeline.pending, (state) => {
                state.error = null;
                state.isTimelineFetching = true;
            })
            .addCase(getTimeline.fulfilled, (state, { payload }: { payload: { timelineData: TimelineData[], timelinePageMeta: TimeLinePageMeta } | any }) => {
                state.timelinePageMeta = payload.timelinePageMeta;
                state.isTimelineFetching = false;
                if (payload.timelinePageMeta.page === 1) {
                    state.timelineData = payload.timelineData;
                } else {
                    state.timelineData = [...(state.timelineData ?? []), ...(payload.timelineData ?? [])];
                }
            })
            .addCase(getTimeline.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isTimelineFetching = false;
            })

            .addCase(viewInvoice.pending, (state) => {
                state.error = null;
                state.invoiceData = null;
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

            .addCase(getAllInvoiceGroups.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getAllInvoiceGroups.fulfilled, (state, action: PayloadAction<any>) => {
                state.invoiceGroups = action.payload.invoiceGroups;
                state.loading = false;
            })
            .addCase(getAllInvoiceGroups.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
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

export const { setInvoice } = invoiceSlice.actions;
