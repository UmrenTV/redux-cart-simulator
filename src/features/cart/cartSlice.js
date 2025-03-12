import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    cartItems: [],
    amount: 0, // total amount of items in the cart
    total: 0, // total price of all items in the cart
    isLoading: true,
};

const url = "https://www.course-api.com/react-useReducer-cart-project";

export const getCartItems = createAsyncThunk(
    "cart/getCartItems",
    async (random, thunkAPI) => {
        try {
            console.log(random);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.log(error);
            //return thunkAPI.rejectWithValue(error.response.data);
            return thunkAPI.rejectWithValue("error fetching");
        }
    }
);

const cartSlice = createSlice({
    name: "cart",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getCartItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cartItems = action.payload;
            })
            .addCase(getCartItems.rejected, (state, action) => {
                console.log(action); // you can see the error message here that we've caused in the thunkAPI if you mess up with the url
                state.isLoading = false;
            });
    },
    reducers: {
        clearCart: (state) => {
            return {
                ...state,
                cartItems: [],
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

export default cartSlice.reducer;
