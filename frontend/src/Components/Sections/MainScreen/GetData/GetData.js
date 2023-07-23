const { useReducer, createContext } = require("react");

export const product = createContext();

const initialValue = {
  products: [],
  loading: true,
  error: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const GetData = (props) => {
  const [state, dispatch] = useReducer(reducer, initialValue);
  const value = { state, dispatch };
  return <product.Provider value={value}>{props.children} </product.Provider>;
};
export default GetData;
