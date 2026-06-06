import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import CartSidebar from "./components/CartSidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";

import ShopList from "./pages/customer/ShopList";
import MenuPage from "./pages/customer/MenuPage";
import CartPage from "./pages/customer/CartPage";
import Checkout from "./pages/customer/Checkout";
import OrderSuccess from "./pages/customer/OrderSuccess";
import Orders from "./pages/customer/Orders";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import MenuManager from "./pages/owner/MenuManager";
import AdminDashboard from "./pages/admin/AdminDashboard";


export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* CUSTOMER */}
        {/* CUSTOMER */}
        <Route path="/shops" element={<ShopList />} /> ✅ FIXED

        <Route path="/menu/:shopId" element={<MenuPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

        <Route
          path="/orders"
          element={
            <ProtectedRoute role="customer">
              <Orders />
            </ProtectedRoute>
          }
        />
        {/* OWNER */}
        <Route
          path="/owner"
          element={
            <ProtectedRoute role="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/menu"
          element={
            <ProtectedRoute role="owner">
              <MenuManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

      </Routes>
      <CartSidebar />
    </BrowserRouter>
  );
}