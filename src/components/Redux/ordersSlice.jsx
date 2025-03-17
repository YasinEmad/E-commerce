// src/Redux/ordersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [], // Array to store order data
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload; // Set orders array
    },
    addOrder: (state, action) => {
      state.orders.push(action.payload); // Add a new order
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderToUpdate = state.orders.find((order) => order.id === orderId);
      if (orderToUpdate) {
        orderToUpdate.status = status; // Update the status of an order
      }
    },
  },
});

export const { setOrders, addOrder, updateOrderStatus } = ordersSlice.actions;

export default ordersSlice.reducer;