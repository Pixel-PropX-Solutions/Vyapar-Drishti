
import { createAsyncThunk } from '@reduxjs/toolkit';
import userApi from '../Api/userApi';


type ViewAllCustomerType = {
    searchQuery?: string;
    filterState?: string;
    company_id: string;
    sortField?: string;
    type?: string;
    is_deleted?: boolean;
    pageNumber?: number;
    limit?: number;
    sortOrder?: string;
}

export const viewAllCustomer = createAsyncThunk(
    'view/all/ledger',
    async (
        {
            searchQuery = '',
            company_id,
            filterState = '',
            pageNumber = 1,
            type = 'All',
            is_deleted = false,
            limit = 10,
            sortField = 'createdAt',
            sortOrder = 'asc',
        }: ViewAllCustomerType,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/ledger/view/all?${company_id !== '' ? 'company_id=' + company_id : ''}${searchQuery !== '' ? '&search=' + searchQuery : ''}${type === '' || type === 'All' ? '' : '&parent=' + type}&is_deleted=${is_deleted}&state=${filterState === 'All-States' ? '' : filterState}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === 'asc' ? '1' : '-1'
                }`
            );

            console.log('view all ledger response', response);

            if (response.data.success === true) {
                const customers = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { customers, pageMeta };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);

export const viewAllCustomerWithType = createAsyncThunk(
    'view/all/ledger/with/type',
    async (
        {
            company_id,
            customerType,
        }: {
            company_id: string;
            customerType: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/ledger/view/ledgers/with/type?company_id=${company_id}&type=${customerType}`
            );

            console.log('viewAllCustomerWithType response', response);

            if (response.data.success === true) {
                const customersList = response.data.data;
                return {customersList};
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);

export const viewAllCustomers = createAsyncThunk(
    'view/all/ledger/list',
    async (
        company_id: string,
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `ledger/view/all/ledgers?company_id=${company_id}`
            );

            console.log('viewAllCustomers response', response);

            if (response.data.success === true) {
                const customersList = response.data.data;
                return { customersList };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);

export const viewCustomer = createAsyncThunk(
    'view/customer',
    async (customer_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/ledger/view/${customer_id}`);

            if (response.data.success === true) {
                return response.data.data[0];
            }
            else { return rejectWithValue('Failed to fetch Customer profile'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed: Unable to fetch chemist profile'
            );
        }
    }
);


export const getCustomer = createAsyncThunk(
    'get/customer',
    async ({ customer_id, start_date, end_date }: { customer_id: string, start_date: string, end_date: string }, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/ledger/view/${customer_id}?start_date=${start_date}&end_date=${end_date}`);
            console.log('getCustomer response', response);

            if (response.data.success === true) {
                return response.data.data[0];
            }
            else { return rejectWithValue('Failed to fetch Customer profile'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed: Unable to fetch chemist profile'
            );
        }
    }
);

export const getCustomerInfo = createAsyncThunk(
    'get/customer/info',
    async (customer_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/ledger/get/${customer_id}`);
            console.log('getCustomerInfo response', response);

            if (response.data.success === true) {
                return response.data.data[0];
            }
            else { return rejectWithValue('Failed to fetch Customer profile'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed: Unable to fetch chemist profile'
            );
        }
    }
);

type viewCutomerInvoicesType = {
    searchQuery?: string;
    customer_id: string;
    company_id: string;
    sortField?: string;
    type?: string;
    pageNumber: number;
    limit?: number;
    sortOrder: 'asc' | 'desc';
    start_date?: string;
    end_date?: string;
}

export const getCustomerInvoices = createAsyncThunk(
    'get/customer/invoices',
    async ({
        searchQuery = '',
        company_id,
        customer_id,
        pageNumber = 1,
        type = 'all',
        limit = 10,
        sortField = 'date',
        sortOrder = 'asc',
        start_date = '',
        end_date = '',
    }: viewCutomerInvoicesType, { rejectWithValue }) => {
        try {
            const response = await userApi.get(
                `/ledger/view/invoices/${customer_id}?${company_id !== '' ? 'company_id=' + company_id : ''}${searchQuery !== '' ? '&search=' + searchQuery : ''}${type !== 'all' ? '&type=' + type : ''}&start_date=${start_date}&end_date=${end_date}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === 'asc' ? '1' : '-1'
                }`
            );

            console.log('Get Customer Invoices API Response', response);

            if (response.data.success === true) {
                const customerInvoices = response.data.data.docs;
                const customerInvoicesPageMeta = response.data.data.meta;
                return { customerInvoices, customerInvoicesPageMeta };
            }
            else { return rejectWithValue('Failed to fetch Customer profile'); }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const deleteCustomer = createAsyncThunk(
    'delete/customer',
    async (customer_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.delete(`/customer/delete/${customer_id}`);

            if (response.data.success === true) {
                return;
            }
            else { return rejectWithValue('Failed to delete Customer profile'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed: Unable to fetch chemist profile'
            );
        }
    }
);

export const restoreCustomer = createAsyncThunk(
    'restore/customer',
    async (customer_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.put(`/customer/restore/${customer_id}`);

            if (response.data.success === true) {
                return;
            }
            else { return rejectWithValue('Failed to delete Customer profile'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed: Unable to fetch chemist profile'
            );
        }
    }
);

export const createCustomer = createAsyncThunk(
    'create/customer',
    async (data: FormData, { rejectWithValue }) => {
        try {
            const response = await userApi.post('/ledger/create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('createCustomer response', response);

            if (response.data.success === true) {
                return;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);

export const updateCustomerDetails = createAsyncThunk(
    'update/customer/details',
    async ({ ledger_details, id }: { ledger_details: { [key: string]: any }; id: string }, { rejectWithValue }) => {
        try {

            const response = await userApi.put(`/ledger/update/details/${id}`, ledger_details);

            console.log('updateCustomer details response', response);

            if (response.data.success === true) {
                return;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);

export const updateCustomer = createAsyncThunk(
    'update/customer',
    async ({ data, id }: { data: FormData; id: string }, { rejectWithValue }) => {
        try {

            console.log('updateChemist data', data);
            const response = await userApi.put(`/customer/update/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // console.log("updateCustomer response", response);

            if (response.data.success === true) {
                return;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);
