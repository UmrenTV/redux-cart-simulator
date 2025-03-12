import { createSlice } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";

const initialState = {
    cartItems: cartItems,
    amount: 1,
    total: 0,
    isLoading: true,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCart: (state) => {
            //state.cartItems = [];
            return {
                ...state,
                cartItems: [],
                // if we don't spread the ...state, and just modify cartItems when returning the state,
                // then all of the other state properties will be removed, and only cartItems will exist in the state.
            };
        },
    },
});

export const { clearCart } = cartSlice.actions;

// console.log(cartSlice);

export default cartSlice.reducer;
