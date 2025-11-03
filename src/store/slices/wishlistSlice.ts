import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WishlistItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  isLoading: boolean;
}

const initialState: WishlistState = {
  items: [],
  isLoading: false,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const exists = state.items.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    setWishlistItems: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = action.payload;
    },
    clearWishlist: (state) => {
      state.items = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  setWishlistItems,
  clearWishlist,
  setLoading,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
