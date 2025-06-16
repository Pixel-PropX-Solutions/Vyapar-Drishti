import { createSlice, PayloadAction, Slice } from "@reduxjs/toolkit";
import { GetCompany } from "../../Utils/types";
import { createCompany, getAllCompanies, getCompany, setCompany } from "../../Services/company";

interface CompanyState {
    company: GetCompany | null;
    companies: Array<GetCompany> | [];
    loading: boolean;
    error: string | null;
    isCompaniesFetching: boolean;
    isCompanyFetching: boolean;
}

const initialState: CompanyState = {
    company: null,
    companies: [],
    loading: false,
    error: null,
    isCompaniesFetching: false,
    isCompanyFetching: false,
};

const companySlice: Slice<CompanyState> = createSlice({
    name: "company",
    initialState,
    reducers: {},
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
                state.isCompanyFetching = true;
            })
            .addCase(getCompany.fulfilled, (state, action: PayloadAction<any>) => {
                state.company = action.payload.company;
                state.isCompanyFetching = false;
            })
            .addCase(getCompany.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isCompanyFetching = false;
            })
           
            .addCase(getAllCompanies.pending, (state) => {
                state.error = null;
                state.isCompaniesFetching = true;
            })
            .addCase(getAllCompanies.fulfilled, (state, action: PayloadAction<any>) => {
                // Ensure companies is an array of GetCompany objects
                state.companies = action.payload.companies;
                state.isCompaniesFetching = false;
            })
            .addCase(getAllCompanies.rejected, (state, action) => {
                state.error = action.payload as string;
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

// export const {  } = companySlice.actions;
export default companySlice.reducer;