import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { GetCompany } from "../../Utils/types";
import { createCompany, getAllCompanies, getCompany, setCompany } from "../../Services/company";

interface CompanyState {
    company: GetCompany | null;
    companies: Array<GetCompany> | [];
    error: string | null;
    loading: boolean;
    isCompaniesFetching: boolean;
    isCompanyFetching: boolean;
}

const initialState: CompanyState = {
    company: null,
    companies: [],
    error: null,
    loading: false,
    isCompaniesFetching: false,
    isCompanyFetching: false,
};


const companySlice: Slice<CompanyState> = createSlice({
    name: "company",
    initialState,
    reducers: {
        setIsCompanyFetching: (state, action: PayloadAction<boolean>) => {
            state.isCompanyFetching = action.payload;
        },
        setIsCompaniesFetching: (state, action: PayloadAction<boolean>) => {
            state.isCompaniesFetching = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createCompany.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(createCompany.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createCompany.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })

            .addCase(getCompany.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.isCompanyFetching = true;
            })
            .addCase(getCompany.fulfilled, (state, action: PayloadAction<any>) => {
                state.company = action.payload.company;
                state.loading = false;
                state.isCompanyFetching = false;
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
                state.isCompanyFetching = false;
            })
           
            .addCase(getAllCompanies.pending, (state) => {
                state.error = null;
                state.loading = true;
                state.isCompaniesFetching = true;
            })
            .addCase(getAllCompanies.fulfilled, (state, action: PayloadAction<any>) => {
                state.companies = action.payload.companies;
                state.loading = false;
                state.isCompaniesFetching = false;
            })
            .addCase(getAllCompanies.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
                state.isCompaniesFetching = false;
            })

            .addCase(setCompany.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(setCompany.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(setCompany.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string
            })

    },
});

const companyReducer = companySlice.reducer;
export default companyReducer;

export const { setIsCompanyFetching, setIsCompaniesFetching } = companySlice.actions;