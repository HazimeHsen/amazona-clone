import { createContext, useReducer } from "react";

export const Store = createContext();

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,

  cart: {
    cartItems: localStorage.getItem("cartItems")
      ? JSON.parse(localStorage.getItem("cartItems"))
      : [],
    shippingAddress: localStorage.getItem("shipping")
      ? JSON.parse(localStorage.getItem("shipping"))
      : {},
    paymentMethod: localStorage.getItem("PaymentMethod")
      ? localStorage.getItem("PaymentMethod")
      : "",
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      const newItems = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItems._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItems : item
          )
        : [...state.cart.cartItems, newItems];
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    case "REMOVE_ITEM": {
      const toRemove = action.payload;
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== toRemove._id
      );
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems,
        },
      };
    }
    case "CART_CLEAR":
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: [],
        },
      };
    case "USER_SIGNIN":
      return { ...state, userInfo: action.payload };
    case "USER_SIGNOUT":
      return {
        ...state,
        userInfo: null,
        cart: { cartItems: [], shippingAddress: {}, paymentMethod: "" },
      };
    case "SAVE_SHIPPING":
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case "SAVE_PAYMENT_METHOD":
      return {
        ...state,
        cart: {
          ...state.cart,
          paymentMethod: action.payload,
        },
      };
    default:
      return state;
  }
};

export const StoreProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
};
