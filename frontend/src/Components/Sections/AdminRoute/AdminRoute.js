import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Store } from "../../Store/Store";

export default function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return (
    <div>
      {userInfo && userInfo.isAdmin ? children : <Navigate to="/signin" />}
    </div>
  );
}
