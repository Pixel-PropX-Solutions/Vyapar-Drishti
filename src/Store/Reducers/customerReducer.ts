import { updateCustomer, getCustomer, createCustomer, deleteCustomer, restoreCustomer, viewAllCustomer, viewAllCustomers, getCustomerInvoices } from '../../Services/customer';
import { PageMeta, GetUserLedgers, CustomersList, AccountingGroups, GetCustomerInvoices } from '../../utils/types';
import { createSlice, PayloadAction, Slice } from '@reduxjs/toolkit';

interface CustomerState {
    customers: Array<GetUserLedgers>;
    isAllCustomerFetching: boolean;
    isAllCustomerInvoicesFetching: boolean;
    customer: any | null;
    customersList: Array<CustomersList> | [];
    customerType: AccountingGroups | null;
    customerInvoices: Array<GetCustomerInvoices> | [];
    loading: boolean,
    error: string | null;
    pageMeta: PageMeta
}

const initialState: CustomerState = {
    customers: [],
    isAllCustomerFetching: false,
    isAllCustomerInvoicesFetching: false,
    customersList: [],
    customerInvoices: [],
    customerType: null,
    customer: null,
    pageMeta: {
        page: 0,
        limit: 0,
        total: 0,
        unique: [],
    },
    loading: false,
    error: null,
};

const customerSlice: Slice<CustomerState> = createSlice({
    name: 'customers',
    initialState,
    reducers: {
        setCustomerType: (state, action: PayloadAction<AccountingGroups | null>) => {
            state.customerType = action.payload;
        },
        resetCustomerState: (state) => {
            state.customers = [];
            state.isAllCustomerFetching = false;
            state.isAllCustomerInvoicesFetching = false;
            state.customer = null;
            state.customersList = [];
            state.customerType = null;
            state.loading = false;
            state.error = null;
            state.pageMeta = {
                page: 0,
                limit: 0,
                total: 0,
                unique: [],
            };
        },
        setCustomers(state, action: PayloadAction<Array<GetUserLedgers>>) {
            state.customers = action.payload
        }
    },

    extraReducers: (builder) => {
        builder

            .addCase(createCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(viewAllCustomer.pending, (state) => {
                state.error = null;
                state.isAllCustomerFetching = true;
            })
            .addCase(viewAllCustomer.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload.pageMeta.page == 1) {
                    state.customers = action.payload.customers;
                } else {
                    state.customers = [...(state.customers ?? []), ...(action.payload.customers ?? [])];
                }
                state.pageMeta = action.payload.pageMeta;
                state.isAllCustomerFetching = false;
            })
            .addCase(viewAllCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAllCustomerFetching = false;
            })

            .addCase(viewAllCustomers.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(viewAllCustomers.fulfilled, (state, action: PayloadAction<any>) => {
                state.customersList = action.payload.customersList;
                state.loading = false;
            })
            .addCase(viewAllCustomers.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(getCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(getCustomer.fulfilled,
                (state, action: PayloadAction<any>) => {
                    state.customer = action.payload;
                    state.loading = false;
                }
            )
            .addCase(getCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getCustomerInvoices.pending, (state) => {
                state.error = null;
                state.isAllCustomerInvoicesFetching = true;
            })
            .addCase(getCustomerInvoices.fulfilled, (state, action: PayloadAction<any>) => {
                if (action.payload.pageMeta.page == 1) {
                    state.customerInvoices = action.payload.customerInvoices;
                } else {
                    state.customerInvoices = [...(state.customerInvoices ?? []), ...(action.payload.customerInvoices ?? [])];
                }
                state.pageMeta = action.payload.pageMeta;
                state.isAllCustomerInvoicesFetching = false;
            })
            .addCase(getCustomerInvoices.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAllCustomerInvoicesFetching = false;
            })


            .addCase(updateCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(updateCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(deleteCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(deleteCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(deleteCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })


            .addCase(restoreCustomer.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(restoreCustomer.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(restoreCustomer.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            });
    },
});

export const { setCustomerType, resetCustomerState, setCustomers } = customerSlice.actions;
const customerReducer = customerSlice.reducer;
export default customerReducer;

// export default customerSlice.reducer ;
