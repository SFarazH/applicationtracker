import React from "react";
import { Route, Navigate, Routes, Outlet } from "react-router-dom";
import Cookies from "universal-cookie";

export default function ProtectedRoutes({ children }) {
  const cookies = new Cookies();
  const token = cookies.get("TOKEN");
  return token ? children : <Navigate to="/" />;
}