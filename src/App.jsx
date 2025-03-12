import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { calculateTotals, getCartItems } from "./features/cart/cartSlice";

import Modal from "./components/Modal";
import Navbar from "./components/Navbar";
import CartContainer from "./components/CartContainer";

function App() {
    const { cartItems, isLoading } = useSelector((state) => state.cart);
    const { isModalOpen } = useSelector((state) => state.modal);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getCartItems());
    }, []);

    useEffect(() => {
        dispatch(calculateTotals());
    }, [cartItems]);

    return (
        <main>
            {isModalOpen && <Modal />}
            <Navbar />
            {isLoading ? <h1>Loading...</h1> : <CartContainer />}
        </main>
    );
}
export default App;
