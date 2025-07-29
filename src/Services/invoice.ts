import userApi from '../Api/userApi';
import { CreateInvoiceData, CreateInvoiceWithGSTData, GetAllVouchars, PageMeta } from '../Utils/types';
import { createAsyncThunk } from '@reduxjs/toolkit';


export const createInvoice = createAsyncThunk(
    'create/invoice',
    async (
        data: CreateInvoiceData,
        { rejectWithValue }
    ): Promise<{ success: boolean } | any> => {
        try {
            const createRes = await userApi.post('invoices/create/vouchar', data);
            console.log('createInvoice response', createRes);
            if (createRes.data.success === true) {
                return { success: true };
            } else {
                rejectWithValue('Product creation failed');
                return { success: false };
            }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Upload or creation failed: Invalid input or server error.'
            );
        }
    }
);

export const createInvoiceWithGST = createAsyncThunk(
    'create/invoice/gst',
    async (
        data: CreateInvoiceWithGSTData,
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post('/invoices/create/vouchar/gst', data);

            if (createRes.data.success === true) {
                return;
            } else {
                return rejectWithValue('Product creation failed');
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const getInvoiceCounter = createAsyncThunk(
    'view/invoices',
    async (
        {
            voucher_type,
            company_id,
        }: {
            voucher_type: string;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/serial-number/get/current/${voucher_type}${company_id !== '' ? '?company_id=' + company_id : ''}`
            );

            if (response.data.success === true) {
                return response.data.data;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


type viewAllInvoicesType = {
    company_id: string;
    pageNumber: number;
    type?: string;
    searchQuery?: string;
    sortField?: string;
    limit?: number;
    sortOrder?: '1' | '-1';
    start_date?: string;
    end_date?: string;
}

export const viewAllInvoices = createAsyncThunk(
    'view/all/invoices',
    async (
        {
            company_id,
            pageNumber,
            searchQuery = '',
            type = '',
            limit = 10,
            sortField = 'created_at',
            sortOrder = '1',
            start_date = '',
            end_date = '',
        }: viewAllInvoicesType,
        { rejectWithValue }
    ): Promise<{ invoices: GetAllVouchars[], pageMeta: PageMeta } | any> => {
        try {
            const response = await userApi.get(
                `invoices/view/all/vouchar?company_id=${company_id}${searchQuery !== '' ? '&search=' + searchQuery : ''}${type !== 'All' ? '&type=' + type : ''}${start_date !== '' ? '&start_date=' + start_date : ''}${end_date !== '' ? '&end_date=' + end_date : ''}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
            );
            console.log('viewAllInvoices response', response.data);

            if (response.data.success === true) {
                const invoices = response.data.data.docs;
                const pageMeta = response.data.data.meta;
                return { invoices, pageMeta };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);


export const viewInvoice = createAsyncThunk(
    'view/invoices',
    async (
        {
            vouchar_id,
            company_id,
        }: {
            vouchar_id: string;
            company_id: string;
        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/get/vouchar/${vouchar_id}?company_id=${company_id}`
            );

            console.log('viewInvoice response', response.data);

            if (response.data.success === true) {
                const invoiceData = response.data.data;
                return { invoiceData };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const printInvoices = createAsyncThunk(
    'print/invoices',
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/print/vouchar?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log('printInvoices response', response.data);

            if (response.data.success === true) {
                return response.data.data;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);


export const printGSTInvoices = createAsyncThunk(
    'print/gst/invoices',
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/print/vouchar/gst?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log('printGSTInvoices response', response.data);

            if (response.data.success === true) {
                return response.data.data;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);

export const printRecieptInvoices = createAsyncThunk(
    'print/receipt/invoices',
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/print/vouchar/receipt?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log('printInvoices response', response.data);

            if (response.data.success === true) {
                const invoceHtml = response.data.data;
                return { invoceHtml };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);


export const printPaymentInvoices = createAsyncThunk(
    'print/payment/invoices',
    async (
        {
            vouchar_id,
            company_id,

        }: {
            vouchar_id: string;
            company_id: string;

        },
        { rejectWithValue }
    ) => {
        try {
            const response = await userApi.get(
                `/invoices/print/vouchar/payment?vouchar_id=${vouchar_id}&company_id=${company_id}`
            );
            console.log('printInvoices response', response.data);

            if (response.data.success === true) {
                const invoceHtml = response.data.data;
                return { invoceHtml };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'Login failed: Invalid credentials or server error.'
            );
        }
    }
);


export const uploadBill = createAsyncThunk(
    'upload/bill',
    async (
        formData: FormData,
        { rejectWithValue }
    ) => {
        try {
            // console.log("uploadBill formData", formData);
            const response = await userApi.post(
                '/extraction/file/upload',
                formData,
            );

            if (response.data.success === true) {
                const invoiceData = response.data.data;
                return { invoiceData };
            } else { return rejectWithValue('File upload failed: No data received.'); }
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                'File upload failed: Server error.'
            );
        }
    }
);
