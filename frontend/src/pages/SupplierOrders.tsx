import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout"; // Import the logout icon
import API from "../api/api";
import { IOrder } from "../interfaces/order.interface";
import { STATUS_TRANSLATIONS } from "../constants/status.constant";
import { showErrorToast, showSuccessToast } from "../utils/toast.utility";
import { useNavigate } from "react-router-dom";

const SupplierOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<IOrder[]>([]);

  // Fetch orders for the supplier
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await API.get("/orders/supplier", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId: number) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/orders/status/supplier/${orderId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showSuccessToast("סטטוס ההזמנה עודכן בהצלחה!");
      fetchOrders();
    } catch (error) {
      showErrorToast(error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/supplier");
  };

  return (
    <Container>
      <IconButton
        color="primary"
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          fontSize: 40,
        }}
      >
        <LogoutIcon sx={{ fontSize: 40 }} />
      </IconButton>
      <Box
        sx={{
          marginTop: 5,
          marginBottom: 2,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h2">הזמנות ספק</Typography>
      </Box>
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                מספר הזמנה
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                מק"ט מוצר
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                שם המוצר
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                מחיר ליחידה
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                כמות
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                מחיר כולל
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                פעולות
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  אין הזמנות קיימות
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: IOrder) => (
                <TableRow key={order.id}>
                  <TableCell align="right">{order.id}</TableCell>
                  <TableCell align="right">{order.itemId}</TableCell>
                  <TableCell align="right">{order.Item.name}</TableCell>
                  <TableCell align="right">
                    {order.Item.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{order.amount}</TableCell>
                  <TableCell align="right">
                    {order.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {order.status === "WAITING" ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleUpdateOrderStatus(order.id)}
                      >
                        קבלת הזמנה
                      </Button>
                    ) : (
                      STATUS_TRANSLATIONS[order.status] || order.status
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SupplierOrders;
