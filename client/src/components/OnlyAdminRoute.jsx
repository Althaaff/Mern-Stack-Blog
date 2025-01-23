import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function OnlyAdminRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}
