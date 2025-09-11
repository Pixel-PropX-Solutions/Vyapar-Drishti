import userApi from '../Api/userApi';
import { CreateInvoiceData, CreateInvoiceWithTAXData, GetAllVouchars, PageMeta, TimelineData, TimeLinePageMeta, UpdateInvoice, UpdateTAXInvoice } from '../Utils/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import RNFetchBlob from 'react-native-blob-util';
// import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';

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

export const createInvoiceWithTAX = createAsyncThunk(
    'create/invoice/tax',
    async (
        data: CreateInvoiceWithTAXData,
        { rejectWithValue }
    ) => {
        try {
            const createRes = await userApi.post('/invoices/create/vouchar/tax', data);
            console.log('createInvoiceWithTAX response', createRes);

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


export const getAllInvoiceGroups = createAsyncThunk(
    'get/all/invoice/groups',
    async (company_id: string, { rejectWithValue }) => {
        try {
            const response = await userApi.get(`/invoices/get/all/vouchar/type?company_id=${company_id}`);

            console.log('Response from getAllInvoiceGroups:', response);

            if (response.data.success === true) {
                const invoiceGroups = response.data.data;
                return { invoiceGroups };
            }
            else { return rejectWithValue('Failed to fetch Customer profile'); }
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
            sortField = 'date',
            sortOrder = '1',
            start_date = '',
            end_date = '',
        }: viewAllInvoicesType,
        { rejectWithValue }
    ): Promise<{ invoices: GetAllVouchars[], pageMeta: PageMeta } | any> => {
        try {
            const response = await userApi.get(
                `invoices/view/all/vouchar?company_id=${company_id}${searchQuery !== '' ? '&search=' + searchQuery : ''}${type !== 'all' ? '&type=' + type : ''}${start_date !== '' ? '&start_date=' + start_date : ''}${end_date !== '' ? '&end_date=' + end_date : ''}&page_no=${pageNumber}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
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

export const updateInvoice = createAsyncThunk(
    'update/invoice/vouchar',
    async (
        data: UpdateInvoice,
        { rejectWithValue }
    ) => {
        try {

            const updateRes = await userApi.put(`/invoices/update/vouchar/${data.vouchar_id}`, data);

            if (updateRes.data.success === true) {
                return;
            } else {
                return rejectWithValue('Invoice update failed');
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const updateTaxInvoice = createAsyncThunk(
    'update/invoice/tax/vouchar',
    async (
        data: UpdateTAXInvoice,
        { rejectWithValue }
    ) => {
        try {

            console.log('updateTaxInvoice:', data);
            const updateRes = await userApi.put(`/invoices/update/vouchar/tax/${data.vouchar_id}`, data);
            console.log('Response from updateTaxInvoice:', updateRes);

            if (updateRes.data.success === true) {
                return;
            } else {
                return rejectWithValue('Invoice update failed');
            }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);

export const deleteInvoice = createAsyncThunk(
    'delete/invoice',
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
            const response = await userApi.delete(
                `/invoices/delete/${vouchar_id}?company_id=${company_id}`
            );

            if (response.data.success === true) {
                return;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const deleteTAXInvoice = createAsyncThunk(
    'delete/tax/invoice',
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
            const response = await userApi.delete(
                `/invoices/tax/delete/${vouchar_id}?company_id=${company_id}`
            );

            if (response.data.success === true) {
                return;
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
        }
    }
);


export const getInvoicesPDF = createAsyncThunk(
    'get/invoices/pdf',
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
                `/invoices/print/vouchar?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                {
                    responseType: 'arraybuffer',
                }
            );
            console.log('Response Get Invoice PDF API', response);

            if (response.status === 200) {
                // Convert blob → base64
                const rawBase64 = Buffer.from(response.data).toString('base64');
                // write file to cache
                const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/invoice-vyapar-drishti.pdf`;
                await RNFetchBlob.fs.writeFile(filePath, rawBase64, 'base64');

                return {
                    rawBase64: rawBase64,
                    filePath: filePath,
                };

            } else {
                return rejectWithValue('Internal Server Error.');
            }
        } catch (error: any) {
            console.error('Failed to fetch PDF:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed to get the PDF something went wrong. Please try again later.'
            );
        }
    }
);


export const getTAXInvoicesPDF = createAsyncThunk(
    'get/tax/invoices/pdf',
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
                `/invoices/print/vouchar/tax?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'arraybuffer' }
            );
            console.log('Response Get Tax Invoice PDF API', response);

            if (response.status === 200) {
                // Convert blob → base64
                const rawBase64 = Buffer.from(response.data).toString('base64');
                // write file to cache
                const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/invoice-vyapar-drishti.pdf`;
                await RNFetchBlob.fs.writeFile(filePath, rawBase64, 'base64');

                return {
                    rawBase64: rawBase64,
                    filePath: filePath,
                };

            } else {
                return rejectWithValue('Internal Server Error.');
            }
        } catch (error: any) {
            console.error('Failed to fetch PDF:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed to get the PDF something went wrong. Please try again later.'
            );
        }
    }
);

export const getRecieptPDF = createAsyncThunk(
    'get/receipt/pdf',
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
                `/invoices/print/vouchar/receipt?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'arraybuffer' }
            );
            console.log('Response Get Receipt Invoice PDF API', response);

            if (response.status === 200) {
                // Convert blob → base64
                const rawBase64 = Buffer.from(response.data).toString('base64');
                // write file to cache
                const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/receipt-vyapar-drishti.pdf`;
                await RNFetchBlob.fs.writeFile(filePath, rawBase64, 'base64');

                return {
                    rawBase64: rawBase64,
                    filePath: filePath,
                };

            } else {
                return rejectWithValue('Internal Server Error.');
            }
        } catch (error: any) {
            console.error('Failed to fetch PDF:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed to get the PDF something went wrong. Please try again later.'
            );
        }
    }
);


export const getPaymentPDF = createAsyncThunk(
    'get/payment/pdf',
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
                `/invoices/print/vouchar/payment?vouchar_id=${vouchar_id}&company_id=${company_id}`,
                { responseType: 'arraybuffer' }
            );
            console.log('Response Get Payment Invoice PDF API', response);

            if (response.status === 200) {
                // Convert blob → base64
                const rawBase64 = Buffer.from(response.data).toString('base64');
                // write file to cache
                const filePath = `${RNFetchBlob.fs.dirs.CacheDir}/invoice-payment-drishti.pdf`;
                await RNFetchBlob.fs.writeFile(filePath, rawBase64, 'base64');

                return {
                    rawBase64: rawBase64,
                    filePath: filePath,
                };

            } else {
                return rejectWithValue('Internal Server Error.');
            }
        } catch (error: any) {
            console.error('Failed to fetch PDF:', error);
            return rejectWithValue(
                error.response?.data?.message ||
                'Failed to get the PDF something went wrong. Please try again later.'
            );
        }
    }
);



export const getTimeline = createAsyncThunk(
    'view/timeline',
    async (
        {
            search,
            category = 'all',
            company_id,
            page_no,
            limit,
            startDate,
            endDate,
            sortField,
            sortOrder,
        }: {
            search: string;
            company_id: string;
            startDate: string;
            endDate: string;
            category?: string;
            page_no: number;
            limit: number;
            sortField: string;
            sortOrder: string;
        },
        { rejectWithValue }
    ): Promise<{ timelineData: TimelineData[], timelinePageMeta: TimeLinePageMeta } | any> => {
        try {
            const response = await userApi.get(
                `/invoices/get/timeline?${company_id ? `company_id=${company_id}&` : ''}${search ? `search=${search}&` : ''}${category !== 'all' ? `category=${category}&` : ''}${startDate ? `start_date=${startDate}&` : ''}${endDate ? `end_date=${endDate}&` : ''}page_no=${page_no}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder === 'asc' ? '1' : '-1'}`
            );

            console.log('View getTimeline response', response);

            if (response.data.success === true) {
                const timelineData = response.data.data.docs;
                const timelinePageMeta = response.data.data.meta;
                return { timelineData, timelinePageMeta };
            } else { return rejectWithValue('Login Failed: No access token recieved.'); }
        } catch (error: any) {
            return rejectWithValue(error?.response?.data?.message);
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
