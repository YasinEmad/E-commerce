import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // يستخدم localStorage
import productsReducer from "./productsSlice";
import cartReducer from "./cartSlice";
import languageReducer from "./languageSlice";
import categoryReducer from "./categorySlice";
import ordersReducer from "./ordersSlice"; // استيراد ordersSlice
import { combineReducers } from "redux";

// إعداد حفظ البيانات (persist)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "orders"], // حدد الـ reducers التي تريد حفظها
};

// دمج جميع الـ reducers
const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  language: languageReducer,
  category: categoryReducer,
  orders: ordersReducer,
});

// إنشاء persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// إنشاء store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // تجنب مشاكل القيم غير القابلة للتسلسل
    }),
});

// إعداد persistor لحفظ البيانات
const persistor = persistStore(store);

export { store, persistor };