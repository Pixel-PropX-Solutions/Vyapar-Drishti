import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthStates } from "../../Utils/enums";
import {
  deleteProduct,
  // sellProduct,
  updateProduct,
  createProduct,
  viewAllProducts,
  viewProduct,
  getProduct,
  // viewProductsWithId,
} from "../../Services/product";
import { PageMeta, GetProduct, ProductCreate, UploadData, ProductUpdate, GetItem } from "../../utils/types";

interface ProductState {
  authState: AuthStates;
  productData: ProductCreate | null;
  product: ProductUpdate | null;
  item: GetItem | null;
  uploadData: UploadData | null;
  // productsListing: Array<ProductListing> | null;
  productsData: Array<GetProduct> | null;
  loading: boolean;
  deletionModal: boolean;
  productId: string;
  pageMeta: PageMeta;
  isProductsFetching: boolean;

  error: string | null;
}

const initialState: ProductState = {
  authState: AuthStates.INITIALIZING,
  productsData: [],
  // productsListing: [],
  productData: null,
  product: null,
  item: null,
  uploadData: null,
  loading: false,
  isProductsFetching: false,
  deletionModal: false,
  productId: "",
  pageMeta: {
    page: 1,
    limit: 10,
    total: 0,
    unique: [],
  },
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductId(state, action: PayloadAction<any>) {
      state.productId = action.payload.productId;
      state.deletionModal = !state.deletionModal;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(viewProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(viewProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.product = action.payload.product;
        state.loading = false;
      })
      .addCase(viewProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(getProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getProduct.fulfilled, (state, action: PayloadAction<any>) => {
        state.item = action.payload.item;
        state.loading = false;
      })
      .addCase(getProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })


      .addCase(viewAllProducts.pending, (state) => {
        state.error = null;
        state.isProductsFetching = true;
      })
      .addCase(viewAllProducts.fulfilled, (state, action: PayloadAction<{productsData: GetProduct[], pageMeta: PageMeta} | any>) => {
          state.pageMeta = action.payload.pageMeta;
          state.isProductsFetching = false;
          if(action.payload.pageMeta.page == 1){
            state.productsData = action.payload.productsData;
          } else {
            state.productsData = [...(state.productsData ?? []), ...(action.payload.productsData ?? [])]
          }
        }
      )
      .addCase(viewAllProducts.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isProductsFetching = false;
      })

      .addCase(updateProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, _action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

const productReduser = productSlice.reducer;
export default productReduser;;


export const { setProductId } = productSlice.actions;