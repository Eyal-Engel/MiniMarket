import { AppBar, Toolbar, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    if (newValue === 0) {
      navigate("/store-owner/orders");
    }
  };

  return (
    <AppBar position="static" sx={{ direction: "ltr", boxShadow: 0 }}>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          MiniMarket
        </Typography>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            border: "none",
            "& .MuiTabs-indicator": {
              backgroundColor: "#ffffff",
            },
          }}
        >
          <Tab label="ניהול הזמנות" />
        </Tabs>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
