import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

interface OrderStatusProps {
  orderId: number;
}

const OrderStatus: React.FC<OrderStatusProps> = ({ orderId }) => {
  const [status, setStatus] = useState<string>("");

  const handleUpdateStatus = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/orders/${orderId}`,
        { status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("Order status updated");
    } catch (error) {
      alert("Error updating order status");
    }
  };

  return (
    <Box>
      <TextField
        label="Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        fullWidth
      />
      <Button onClick={handleUpdateStatus}>Update Status</Button>
    </Box>
  );
};

export default OrderStatus;
