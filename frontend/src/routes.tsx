import SupplierAuth from "./pages/SupplierAuth";
import SupplierOrders from "./pages/SupplierOrders";
import StoreOwnerOrders from "./pages/StoreOwnerOrders";
import { Routes, Route, Navigate } from "react-router-dom";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/supplier" />} />
      <Route path="/store-owner/orders" element={<StoreOwnerOrders />} />
      <Route path="/supplier" element={<SupplierAuth />} />
      <Route path="/supplier/orders" element={<SupplierOrders />} />
      <Route path="*" element={<Navigate to="/supplier" />} />
    </Routes>
  );
};

export default AppRoutes;
