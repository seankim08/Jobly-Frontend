import React, { useContext } from "react";
import { Route, Navigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

function PrivateRoute({ exact, path, children }) {
  const { currentUser } = useContext(UserContext);

  console.debug(
      "PrivateRoute",
      "exact=", exact,
      "path=", path,
      "currentUser=", currentUser,
  );

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;