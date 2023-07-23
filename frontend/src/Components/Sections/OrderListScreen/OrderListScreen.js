import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import { Store } from "../../Store/Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import { Button } from "react-bootstrap";
import "./OrderListScreen.css";
import { toast } from "react-toastify";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
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
export const OrderListScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      order: {},
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/orders`, {
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
  const deleteOrder = async (orderId) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/delete/${orderId}`);
        toast.success("order deleted successfully");
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
        <title>Order List</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : loadingDelete ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <h1>Order History</h1>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th title="DELIVERED" className="on-not-show">
                  DELIVERED
                </th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td title={order._id} className="on-not-show">
                    {order._id}
                  </td>
                  <td title={order._id} className="on-not-show">
                    {order.user ? order.user.name : "DELETED USER"}
                  </td>
                  <td
                    title={order.createdAt.substring(0, 10)}
                    className="on-not-show">
                    {order.createdAt.substring(0, 10)}
                  </td>
                  <td>{order.totalPrice.toFixed(2)}</td>
                  <td
                    title={order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                    className="on-not-show">
                    {order.isPaid ? order.paidAt.substring(0, 10) : "No"}
                  </td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : "No"}
                  </td>
                  <td>
                    <Button
                      type="button"
                      className="me-1"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}>
                      Details
                    </Button>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => {
                        deleteOrder(order._id);
                      }}>
                      DELETE
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
