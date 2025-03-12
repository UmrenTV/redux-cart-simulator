import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import cartItems from "../../cartItems";
import { openModal } from "../modal/modalSlice"; // example use  below in thunkAPI

const initialState = {
    cartItems: cartItems,
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
            //console.log(thunkAPI.getState()); // this is complete state, of all features we've set up, which is very useful
            //thunkAPI.dispatch(openModal()); // you can do lots of things with thunkAPI, like open modal, or dispatch other actions from other features
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.log(error);
            //return thunkAPI.rejectWithValue(error.response.data);
            return thunkAPI.rejectWithValue("error fetching");
            // if you mess up with the url, you will get an error, and you can catch it here, and then you can return the error message to the user
            // // I've added console.log in the 'rejected' case below, so you can see the error message in the console
        }

        // return fetch(url)
        //     .then((response) => response.json())
        //     .catch((error) => {
        //         console.log(error);
        //     });
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
                // console.log(action.payload);
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
