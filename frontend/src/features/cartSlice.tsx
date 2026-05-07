import { createSlice } from "@reduxjs/toolkit";
import type { ProductThumbnail } from "../../../shared/types/api";

const initialState: ProductThumbnail[] = [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (_, action) => {
      return action.payload;
    },

    addItem: (state, action) => {
      state.push({ ...action.payload, quantity: 1 });
    },

    updateQuantity: (state, action) => {
      const item = state.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    removeItem: (state, action) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setCart, addItem, updateQuantity, removeItem } =
  cartSlice.actions;
export default cartSlice.reducer;
