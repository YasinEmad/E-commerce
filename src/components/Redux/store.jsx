import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import languageReducer from "./languageSlice";
import categoryReducer from "./categorySlice";
import ordersReducer from "./ordersSlice"; // Import the ordersSlice

const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    language: languageReducer,
    category: categoryReducer,
    orders: ordersReducer, // Add the orders reducer
  },
});

export default store;