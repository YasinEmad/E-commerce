import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// دالة لجلب المنتجات حسب الفئة
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchByCategory",
  async (category) => {
    // إذا كانت الفئة محددة، نستخدم endpoint الفئة
    if (category) {
      const response = await fetch(`https://dummyjson.com/products/category/${category}`);
      const data = await response.json();
      return data.products;
    }

    // إذا لم يتم تحديد فئة، نستخدم endpoint المنتجات العامة
    const response = await fetch(`https://dummyjson.com/products`);
    const data = await response.json();
    return data.products;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle", // يمكن أن تكون: idle, loading, succeeded, failed
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export default productsSlice.reducer;