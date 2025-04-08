import {
  Box,
  Table,
  Button,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Container,
  Typography,
  IconButton,
  TableContainer,
} from "@mui/material";

import {
  updateOrderStatus,
  fetchSupplierOrders,
} from "../services/orders.service";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { IOrder } from "../interfaces/order.interface";
import { STATUS_TRANSLATIONS } from "../constants/status.constant";
import { showErrorToast, showSuccessToast } from "../utils/toast.utility";

const SupplierOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<IOrder[]>([]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token not found");
      const response = await fetchSupplierOrders(token);
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
      if (!token) throw new Error("Token not found");
      await updateOrderStatus(orderId, token);
      showSuccessToast("סטטוס ההזמנה עודכן בהצלחה!");
      fetchOrders();
    } catch (error) {
      showErrorToast(error);
    }
  };

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
      <TableContainer
        sx={{
          marginTop: 2,
          maxHeight: "70vh",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                מספר הזמנה
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                מק"ט מוצר
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                שם בעל המכולת
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                שם החברה
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 180 }}
              >
                מספר טלפון של בעל המכולת
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                שם המוצר
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                מחיר ליחידה
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 100 }}
              >
                כמות
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 120 }}
              >
                מחיר כולל
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                פעולות
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  אין הזמנות קיימות
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order: IOrder) => (
                <TableRow key={order.id}>
                  <TableCell align="right">{order.id}</TableCell>
                  <TableCell align="right">{order.itemId}</TableCell>
                  <TableCell align="right">
                    {order.storeOwner.fullname}
                  </TableCell>
                  <TableCell align="right">
                    {order.storeOwner.companyName}
                  </TableCell>
                  <TableCell align="right">
                    {order.storeOwner.phoneNumber}
                  </TableCell>
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
