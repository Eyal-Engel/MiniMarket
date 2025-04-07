import {
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  Container,
  Typography,
  InputLabel,
  FormControl,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
import {
  fetchSuppliers,
  fetchItemsBySupplier,
} from "../services/suppliers.service";
import { IOrder } from "../interfaces/order.interface";
import { ISupplier } from "../interfaces/supplier.interface";
import { STATUS_TRANSLATIONS } from "../constants/status.constant";
import { showErrorToast, showSuccessToast } from "../utils/toast.utility";
import API from "../api/api";
import { ORDER_STATUSES } from "../constants/order.constant";

const StoreOwnerOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const [totalPrice, setTotalPrice] = useState<number>(0);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/storeOwner/1");
      setOrders(response.data);
    } catch (error) {
      showErrorToast(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Fetch suppliers
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

  // Fetch items by supplier
  const handleSupplierChange = async (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setSelectedItem(""); // Reset selected item when switching suppliers
    setAmount(""); // Reset amount
    setTotalPrice(0); // Reset total price
    setItems([]); // Reset items list

    if (!supplierId) {
      return;
    }

    try {
      const data = await fetchItemsBySupplier(supplierId);
      setItems(data);
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        // Handle "No items found for this supplier" error
        setItems([]);
      } else {
        showErrorToast(error);
      }
    }
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    // Prevent invalid input (e.g., 'e', negative numbers, decimals)
    if (!/^\d*$/.test(value)) return;

    setAmount(value);

    // Calculate total price
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
      alert("All fields are required.");
      return;
    }

    try {
      await API.post("/orders", {
        storeOwnerId: 1,
        itemId: selectedItem,
        amount: Number(amount),
      });
      setOpenDialog(false);
      showSuccessToast("Order created successfully!");
      fetchOrders(); // Refresh orders after creating a new one
    } catch (error: any) {
      showErrorToast(error); // הצגת הודעת השגיאה
    }
  };

  const handleUpdateOrderStatusByStoreOwner = async (orderId: number) => {
    try {
      await API.put(`/orders/status/storeOwner/${orderId}`);
      showSuccessToast("Order status updated successfully!");
      fetchOrders(); // Refresh orders after updating status
    } catch (error: any) {
      showErrorToast(error); // הצגת הודעת השגיאה
    }
  };

  // Check if the create order button should be disabled
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
      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                מק"ט מוצר
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                שם החברה
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                שם הנציג
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                טלפון הנציג
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
                        עדכון הזמנה לבוצע
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

      {/* Dialog for creating a new order */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{ "& .MuiDialog-paper": { width: "500px", height: "400px" } }} // קביעת גודל קבוע לפופ-אפ
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
                  handleAmountChange(amount); // Recalculate total price
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
            <Typography sx={{ marginBottom: 2, color: "red" }}>
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
