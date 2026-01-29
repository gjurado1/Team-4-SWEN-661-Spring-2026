import React from "react";
import { Outlet, useLocation } from "react-router";
import { BottomNav } from "../navigation/BottomNav";

export const AppLayout: React.FC = () => {
  const location = useLocation();

  const hideNav =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password";

  const variant: "caregiver" | "patient" =
    location.pathname.startsWith("/caregiver") ? "caregiver" : "patient";

  return (
    <div className="min-h-screen">
      <Outlet />
      {!hideNav && <BottomNav variant={variant} />}
    </div>
  );
};
