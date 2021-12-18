import { createContext, useReducer } from "react";

export const CartContext = createContext();

const initialState = {
  partnerId: "",
  cartItems: [],
  isCheckout: false,
};

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "CART_ADD_ITEM":
      localStorage.setItem(
        "cart",
        JSON.stringify({
          partnerId: payload.id,
          cartItems: [...payload.items],
          isCheckout: payload.isCheckout,
        })
      );
      return {
        partnerId: payload.id,
        cartItems: [...payload.items],
        isCheckout: payload.isCheckout,
      };

    case "CART_REMOVE_ITEM":
      localStorage.setItem(
        "cart",
        JSON.stringify({
          partnerId: payload.id,
          cartItems: [...payload.items],
          isCheckout: payload.isCheckout,
        })
      );
      return {
        partnerId: payload.id,
        cartItems: [...payload.items],
        isCheckout: payload.isCheckout,
      };

    case "CART_CHECKOUT_SUCCESS":
      localStorage.removeItem("transactionId");
      localStorage.removeItem("cart");

      return {
        partnerId: "",
        cartItems: [],
        isCheckout: false,
      };
    default:
      throw new Error();
  }
};

export const CartContextProvider = ({ children }) => {
  const [cart, cartDispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={[cart, cartDispatch]}>
      {children}
    </CartContext.Provider>
  );
};
