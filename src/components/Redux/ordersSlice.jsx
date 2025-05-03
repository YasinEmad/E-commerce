// src/Redux/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrdersFromAPI, updateOrderStatusInAPI } from "../../api/orders";

// Async thunk for fetching orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchOrdersFromAPI();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for updating order status
export const updateOrderStatusAsync = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, itemId, status }, { rejectWithValue }) => {
    try {
      await updateOrderStatusInAPI({ orderId, itemId, status });
      return { orderId, itemId, status };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
      try {
        localStorage.setItem("orders", JSON.stringify(state.orders));
      } catch (error) {
        console.error("Failed to save orders:", error);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchOrders
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle updateOrderStatus
      .addCase(updateOrderStatusAsync.fulfilled, (state, action) => {
        const { orderId, itemId, status } = action.payload;
        state.orders = state.orders.map(order =>
          order.id === orderId
            ? {
                ...order,
                items: order.items.map(item =>
                  item.id === itemId ? { ...item, status } : item
                )
              }
            : order
        );
        state.error = null;
      })
      .addCase(updateOrderStatusAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export const { addOrder } = ordersSlice.actions;
export const selectOrders = state => state.orders.orders;
export const selectOrdersStatus = state => state.orders.status;
export const selectOrdersError = state => state.orders.error;

export default ordersSlice.reducer;