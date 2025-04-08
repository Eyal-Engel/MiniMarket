import {
  Box,
  Table,
  Button,
  Dialog,
  Select,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  Container,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from "@mui/material";

import {
  createOrder,
  fetchStoreOwnerOrders,
  updateOrderStatusByStoreOwner,
} from "../services/orders.service";

import {
  fetchSuppliers,
  fetchItemsBySupplier,
} from "../services/suppliers.service";

import { useState, useEffect } from "react";
import { IOrder } from "../interfaces/order.interface";
import { ISupplier } from "../interfaces/supplier.interface";
import { ORDER_STATUSES } from "../constants/order.constant";
import { STATUS_TRANSLATIONS } from "../constants/status.constant";
import { showErrorToast, showSuccessToast } from "../utils/toast.utility";
import { toast } from "react-toastify";

const StoreOwnerOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const fetchOrders = async () => {
    try {
      const response = await fetchStoreOwnerOrders(1);
      setOrders(response.data);
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await fetchSuppliers();
        setSuppliers(data);
      } catch (error) {
        showErrorToast(error);
      }
    };

    loadSuppliers();
  }, []);

  const handleSupplierChange = async (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setSelectedItem("");
    setAmount("");
    setTotalPrice(0);
    setItems([]);

    if (!supplierId) {
      return;
    }

    try {
      const data = await fetchItemsBySupplier(supplierId);
      setItems(data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        setItems([]);
      } else {
        showErrorToast(error);
      }
    }
  };

  const handleAmountChange = (value: string) => {
    if (!/^\d*$/.test(value)) return;

    setAmount(value);

    const selectedItemData = items.find((item) => item.id === selectedItem);
    if (selectedItemData && value) {
      setTotalPrice(selectedItemData.price * parseInt(value, 10));
    } else {
      setTotalPrice(0);
    }
  };

  const handleCreateOrder = async () => {
    if (
      !selectedSupplier ||
      !selectedItem ||
      !amount ||
      parseInt(amount, 10) <= 0
    ) {
      toast.error("יש למלא את כלל השדות");
      return;
    }

    try {
      await createOrder({
        storeOwnerId: 1,
        itemId: selectedItem,
        amount: Number(amount),
      });
      setOpenDialog(false);
      showSuccessToast("ההזמנה בוצעה בהצלחה!");
      fetchOrders();
    } catch (error: any) {
      showErrorToast(error);
    }
  };

  const handleUpdateOrderStatusByStoreOwner = async (orderId: number) => {
    try {
      await updateOrderStatusByStoreOwner(orderId);
      showSuccessToast("סטטוה ההזמנה עודכן בהצלחה!");
      fetchOrders();
    } catch (error: any) {
      showErrorToast(error);
    }
  };

  const isCreateOrderDisabled =
    !selectedSupplier || !selectedItem || !amount || parseInt(amount, 10) <= 0;

  return (
    <Container>
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
        <Typography variant="h2">ניהול הזמנות</Typography>
        <Button
          sx={{ height: 50 }}
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          יצירת הזמנה חדשה
        </Button>
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
                מק"ט מוצר
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                שם החברה
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                שם הנציג
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 150 }}
              >
                טלפון הנציג
              </TableCell>
              <TableCell
                align="right"
                sx={{ fontWeight: "bold", minWidth: 200 }}
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
                סטטוס
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: IOrder) => (
                <TableRow key={order.id}>
                  <TableCell align="right">{order.itemId}</TableCell>
                  <TableCell align="right">
                    {order.Supplier.companyName}
                  </TableCell>
                  <TableCell align="right">
                    {order.Supplier.representativeName}
                  </TableCell>
                  <TableCell align="right">{order.Supplier.phone}</TableCell>
                  <TableCell align="right">{order.Item.name}</TableCell>
                  <TableCell align="right">
                    {order.Item.price.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">{order.amount}</TableCell>
                  <TableCell align="right">
                    {order.totalPrice.toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {order.status === ORDER_STATUSES.IN_PROCESS ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          handleUpdateOrderStatusByStoreOwner(order.id)
                        }
                      >
                        עדכון הזמנה להושלמה
                      </Button>
                    ) : (
                      STATUS_TRANSLATIONS[order.status] || order.status
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell align="center" colSpan={9}>
                  אין הזמנות קיימות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{ "& .MuiDialog-paper": { width: "500px", height: "400px" } }}
      >
        <DialogTitle>יצירת הזמנה חדשה</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>ספק</InputLabel>
            <Select
              value={selectedSupplier}
              onChange={(e) => handleSupplierChange(e.target.value)}
            >
              {suppliers.map((supplier: ISupplier) => (
                <MenuItem
                  key={supplier.id}
                  value={supplier.id}
                >{`${supplier.companyName} - ${supplier.representativeName}`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {items.length > 0 ? (
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>מוצר</InputLabel>
              <Select
                value={selectedItem}
                onChange={(e) => {
                  setSelectedItem(e.target.value);
                  handleAmountChange(amount);
                }}
              >
                {items.map((item) => (
                  <MenuItem key={item.id} value={item.id}>{`${
                    item.name
                  } - ${item.price.toFixed(2)} ₪`}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <Typography
              sx={{ marginBottom: 2, color: "red", textAlign: "center" }}
            >
              {selectedSupplier
                ? "לא קיימים מוצרים אצל ספק זה."
                : "בחר ספק כדי להציג את המוצרים."}
            </Typography>
          )}

          <TextField
            fullWidth
            label="כמות"
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            sx={{ marginBottom: 2 }}
            inputProps={{ min: 1 }}
          />

          <Typography variant="h6" sx={{ marginTop: 2 }}>
            מחיר כולל: {totalPrice.toFixed(2)} ₪
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>ביטול</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateOrder}
            disabled={isCreateOrderDisabled}
          >
            יצירת הזמנה
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StoreOwnerOrders;
