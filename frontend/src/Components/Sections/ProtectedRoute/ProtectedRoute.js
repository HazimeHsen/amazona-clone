import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../../Store/Store";

export default function ProtectedRoute({ children }) {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  return <div>{userInfo ? children : <Navigate to="/signin" />}</div>;
}
