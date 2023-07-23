import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import { Store } from "../../Store/Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import { Button } from "react-bootstrap";
import "./ProductListScreen.css";
import { toast } from "react-toastify";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export const ProductListScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, products, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: {},
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/products`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: ErrorCatch(error) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete, userInfo]);
  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/products/delete/${productId}`);
        toast.success("Product deleted successfully");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (error) {
        toast.error(ErrorCatch(error));
        dispatch({
          type: "DELETE_FAIL",
        });
      }
    }
  };
  return (
    <div>
      <Helmet>
        <title>Products List</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : loadingDelete ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="d-flex justify-content-between m-3">
            <h1>Products List</h1>
            <Button
              onClick={() => {
                navigate("/admin/createproduct/");
              }}>
              Add Product
            </Button>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td title={product._id} className="on-not-show">
                    {product._id}
                  </td>
                  <td title={product.name} className="on-not-show">
                    {product.name}
                  </td>
                  <td title={product.price} className="on-not-show">
                    ${product.price}
                  </td>
                  <td title={product.category} className="on-not-show">
                    {product.category}
                  </td>
                  <td>{product.brand}</td>
                  <td>
                    <Button
                      className="me-1"
                      type="button"
                      onClick={() => {
                        navigate(`/admin/createproduct?id=${product._id}`);
                      }}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => {
                        deleteProduct(product._id);
                      }}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
