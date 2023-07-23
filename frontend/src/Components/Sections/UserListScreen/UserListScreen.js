import React, { useContext, useEffect, useReducer } from "react";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../../LoadingBox/LoadingBox";
import MessageBox from "../../MessageBox/MessageBox";
import { Store } from "../../Store/Store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorCatch from "../../../ErrorCatch";
import { Button } from "react-bootstrap";
import "./UserListScreen.css";
import { toast } from "react-toastify";
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, Users: action.payload, error: "" };
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
export const UserListScreen = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, error, Users, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      Users: {},
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/users/list`);
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
  const DeleteUser = async (id) => {
    if (window.confirm("Are you sure to delete?")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/users/delete/${id}`);
        toast.success("user deleted successfully");
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
    <div className="user-list">
      <Helmet>
        <title>User History</title>
      </Helmet>
      {loading ? (
        <LoadingBox />
      ) : loadingDelete ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <h1>Users History</h1>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th title="Login-Date" className="on-not-show">
                  Login-Date
                </th>
                <th title="isAdmin" className="on-not-show">
                  isAdmin
                </th>
                <th title="Actions" className="on-not-show">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {Users.map((user) => (
                <tr key={user._id}>
                  <td title={user._id} className="on-not-show">
                    {user._id}
                  </td>
                  <td title={user.name} className="on-not-show">
                    {user.name}
                  </td>
                  <td title={user.email} className="on-not-show">
                    {user.email}
                  </td>
                  <td
                    title={user.createdAt.substring(0, 10)}
                    className="on-not-show">
                    {user.createdAt.substring(0, 10)}
                  </td>
                  <td title={user.isAdmin} className="on-not-show">
                    {user.isAdmin ? <div>Yes</div> : <div>No</div>}
                  </td>
                  <td>
                    <Button
                      className="me-1 "
                      type="button"
                      onClick={() => {
                        navigate(`/admin/user/${user._id}`);
                      }}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      type="button"
                      onClick={() => {
                        DeleteUser(user._id);
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
