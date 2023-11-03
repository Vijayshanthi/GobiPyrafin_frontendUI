import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import Dashboard from "../Dashboard/Dashboard";
import IncomeDashboard from "../../Income/IncomeDashboard";
import ExpenseDashboard from "../../Expense/ExpenseDashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import TdsDashboard from "../TDS/TdsDashboard";
 
// import Gst from "../gst/Gst1.js";
// import PayrollDashboard from "../Payroll/PayrollDashboard";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Gst1 from "../gst/Gst1";
import Gst2 from "../gst/Gst2";
import Gst3 from "../gst/Gst3B";

const Layout = () => {
  const [showNavBar, setShowNavBar] = useState(true);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleGSTClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleGSTClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("tokenauth");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderSelectedComponent = () => {
    const componentStyle = {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '130vh',
      background: 'linear-gradient(180deg, #B6B6B6 -25.36%, #FFF 98.23%)',
      // backgroundImage:
      //   'url("https://static.vecteezy.com/system/resources/thumbnails/000/570/382/small/1543.jpg")',
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
    };
    
    if (selectedTab === "dashboard") {
      return (
        <div style={componentStyle}>
          <Dashboard />
        </div>
      );
    } else if (selectedTab === "income") {
      return (
        <div style={componentStyle}>
          <IncomeDashboard />
        </div>
      );
    } else if (selectedTab === "expenses") {
      return (
        <div style={componentStyle}>
          <ExpenseDashboard />
        </div>
      );
    } else if (selectedTab === "tdsdashboard") {
      return (
        <div style={componentStyle}>
          <TdsDashboard />
        </div>
      );
    } else if (selectedTab === "incomegst") {
      return (
        <div style={componentStyle}>
          <Gst1 />
        </div>
      );
    } else if (selectedTab === "expensegst") {
      return (
        <div style={componentStyle}>
          <Gst2 />
        </div>
      );
    } else if (selectedTab === "gstsales") {
      return (
        <div style={componentStyle}>
          <Gst3 />
        </div>
      );
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
    localStorage.setItem("selectedTab", tab);
  };

  useEffect(() => {
    const storedTab = localStorage.getItem("selectedTab");
    if (storedTab) {
      setSelectedTab(storedTab);
    }
  }, []);
  return (
    <div style={{ display: "flex" }}>
      {showNavBar && (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              backgroundColor: "#eee;",
            },
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              style={{
                fontSize: "180%",
                color: "secondary",
                padding: "10px",
                fontFamily: 'Vazir',
                color: "Black",
                fontWeight: "bold",
              }}
            >
              PYRA-FIN
            </Typography>
          </Toolbar>
          <List>
            <Divider />
            <ListItem
              button
              key="dashboard"
              onClick={() => handleTabClick("dashboard")}
              sx={{
                "&:hover": {
                  backgroundColor: "#397db9",
                  color: "397db9",
                  fontWeight: "bold", // Apply bold font style
                  fontSize: "20.2rem", // Adjust the font size
                },
              }}
            >
              <ListItemIcon>
                <DashboardIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary="Dashboard" style={{ color: "Black" }} />
            </ListItem>
            <ListItem
              button
              key="income"
              onClick={() => handleTabClick("income")}
              sx={{
                "&:hover": {
                  backgroundColor: "#397db9",
                },
              }}
            >
              <ListItemIcon>
                <MonetizationOnIcon style={{ color: "Black" }} />
              </ListItemIcon>
              <ListItemText primary="Income" style={{ color: "Black" }} />
            </ListItem>
            <ListItem
              button
              key="expenses"
              onClick={() => handleTabClick("expenses")}
              sx={{
                "&:hover": {
                  backgroundColor: "#397db9",
                },
              }}
            >
              <ListItemIcon>
                <AccountBalanceWalletIcon style={{ color: "Black" }} />
              </ListItemIcon>
              <ListItemText primary="Expenses" style={{ color: "Black" }} />
            </ListItem>
            <ListItem
              button
              key="tdsdashboard"
              onClick={() => handleTabClick("tdsdashboard")}
              sx={{
                "&:hover": {
                  backgroundColor: "#397db9",
                },
              }}
            >
              <ListItemIcon>
                <AccountBalanceIcon style={{ color: "Black" }} />
              </ListItemIcon>
              <ListItemText primary="TDS" style={{ color: "Black" }} />
            </ListItem>
            <ListItem
              button
              key="gst"
              onClick={handleGSTClick}
              sx={{
                "&:hover": {
                  backgroundColor: "#397db9",
                },
              }}
            >
              <ListItemIcon>
                <ArrowOutwardIcon style={{ color: "Black" }} />
              </ListItemIcon>
              <ListItemText primary="GST" style={{ color: "Black" }} />
              <ArrowDropDownIcon style={{ color: "Black" }} />

            </ListItem>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleGSTClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem onClick={() => handleTabClick("incomegst")}>
                GST-1
              </MenuItem>
              <MenuItem onClick={() => handleTabClick("expensegst")}>
                GST-2
              </MenuItem>
              <MenuItem onClick={() => handleTabClick("gstsales")}>
                GST-3B
              </MenuItem>
            </Menu>
            <ListItem
              button
              key="logout"
              onClick={handleLogout}
              sx={{
                "&:hover": {
                  backgroundColor: "#397db9",
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon style={{ color: "Black" }} />
              </ListItemIcon>
              <ListItemText primary="Logout" style={{ color: "Black" }} />
            </ListItem>
          </List>
        </Drawer>
      )}
      <div style={{ flex: 1 }}>{renderSelectedComponent()}</div>
    </div>
  );
};
export default Layout;
