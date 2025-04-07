import { Box } from "@mui/material";
import SupplierAuth from "./pages/SupplierAuth";
import Sidebar from "./components/Sidebar/Sidebar";
import StoreOwnerOrders from "./pages/StoreOwnerOrders";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Box
        sx={{
          display: "flex",
          direction: "rtl",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Sidebar />

        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              maxHeight: "100vh",
            }}
          >
            <Routes>
              <Route
                path="/store-owner/orders"
                element={<StoreOwnerOrders />}
              />
              <Route path="/supplier" element={<SupplierAuth />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
