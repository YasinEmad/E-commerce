import { createSlice } from "@reduxjs/toolkit";

// Helper function to load cart from localStorage
const loadCartFromLocalStorage = () => {
  try {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCartFromLocalStorage(), // Initialize cart from localStorage
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const index = state.items.findIndex((i) => i.id === item.id);

      if (index !== -1) {
        // If item already exists, increment its quantity
        state.items[index].quantity += 1;
      } else {
        // If item doesn't exist, add it to the cart with quantity 1
        state.items.push({ ...item, quantity: 1 });
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload.id);

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (quantity <= 0) {
          // If quantity is 0 or less, remove the item from the cart
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          // Update the item's quantity
          item.quantity = quantity;
        }
      }

      // Save updated cart to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];

      // Clear cart from localStorage
      localStorage.removeItem("cart");
    },
    setCart: (state, action) => {
      state.items = action.payload; // Set cart items from payload
    },
  },
});

// Export actions
export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;

// Selector to calculate the total price of the cart
export const selectTotalPrice = (state) => {
  return state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Selector to get the total number of items in the cart
export const selectTotalItems = (state) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

export default cartSlice.reducer;