import { Routes, Route } from "react-router-dom";
import StoreOwnerOrders from "./pages/StoreOwnerOrders";
import SupplierAuth from "./pages/SupplierAuth";
import SupplierOrders from "./pages/SupplierOrders";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/store-owner/orders" element={<StoreOwnerOrders />} />
      <Route path="/supplier" element={<SupplierAuth />} />
      <Route path="/supplier/orders" element={<SupplierOrders />} />
    </Routes>
  );
};

export default AppRoutes;
