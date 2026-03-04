import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../auth/ProtectedRoute";

import Home from "../pages/Home";
import Products from "../pages/Products";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import CartPage from "../features/cart/CartPage";
import Checkout from "../pages/Checkout";
import OrderSuccess from "../pages/OrderSuccess";

import AdminDashboard from "../features/admin/AdminDashboard";
import SellerDashboard from "../features/seller/SellerDashboard";
import CustomerDashboard from "../features/customer/CustomerDashboard";

import MainLayout from "../layouts/MainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },

      {
        path: "cart",
        element: (
          <ProtectedRoute roles={["customer"]}>
            <CartPage />
          </ProtectedRoute>
        )
      },
      { path: "checkout", element: (
        <ProtectedRoute roles={["customer"]}>
          <Checkout />
        </ProtectedRoute>
      ) },
      { path: "order/success", element: <OrderSuccess /> },

      {
        path: "admin",
        element: (
          <ProtectedRoute roles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        )
      },

      {
        path: "seller",
        element: (
          <ProtectedRoute roles={["seller"]}>
            <SellerDashboard />
          </ProtectedRoute>
        )
      },

      {
        path: "account",
        element: (
          <ProtectedRoute roles={["customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        )
      }
    ]
  }
]);