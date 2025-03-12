import { createSlice } from "@reduxjs/toolkit";
import cartItems from "../../cartItems";

const initialState = {
    cartItems: cartItems,
    amount: 0, // total amount of items in the cart
    total: 0, // total price of all items in the cart
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
        removeItem: (state, action) => {
            const itemId = action.payload;
            const cartItems = state.cartItems.filter((item) => {
                return item.id !== itemId;
            });
            return {
                ...state,
                cartItems,
            };
        },
        increase: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => {
                return item.id === payload;
            });
            cartItem.amount += 1;
            // you can also modify the state directly like this, compared to above where I return the state
        },
        decrease: (state, { payload }) => {
            const cartItem = state.cartItems.find((item) => {
                return item.id === payload;
            });
            if (cartItem.amount === 1) {
                state.cartItems = state.cartItems.filter(
                    (item) => item.id !== payload
                );
            } else cartItem.amount -= 1;
        },
        calculateTotals: (state) => {
            let total = 0;
            let amount = 0;
            state.cartItems.forEach((item) => {
                total += item.price * item.amount;
                amount += item.amount;
            });
            state.total = total.toFixed(2);
            state.amount = amount;
        },
    },
});

export const { clearCart, removeItem, increase, decrease, calculateTotals } =
    cartSlice.actions;

// console.log(cartSlice);

export default cartSlice.reducer;
