import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProductItemRes, ProductRes } from "@shared/dtos";

const initialState: ProductItemRes[] = [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (_, action: PayloadAction<ProductItemRes[]>) => {
      return action.payload;
    },

    addItem: (state, action: PayloadAction<ProductRes>) => {
      state.push({ ...action.payload, quantity: 1 });
    },

    updateQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const item = state.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },

    removeItem: (state, action: PayloadAction<number>) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setCart, addItem, updateQuantity, removeItem } =
  cartSlice.actions;
export default cartSlice.reducer;
