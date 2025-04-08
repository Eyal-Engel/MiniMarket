import AppRoutes from "./routes";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar/Sidebar";
import { BrowserRouter as Router } from "react-router-dom";

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
            <AppRoutes />
          </Box>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
