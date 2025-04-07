import API from "../api/api";
import { IOrder } from "../interfaces/order.interface";

export const fetchOrdersByMarketOwner = async (
  marketOwnerId: number
): Promise<IOrder[]> => {
  const response = await API.get(`/orders/storeOwner/${marketOwnerId}`);
  return response.data;
};

export const createOrder = async (orderData: {
  storeOwnerId: number;
  itemId: string;
  amount: number;
}): Promise<void> => {
  await API.post("/orders", orderData);
};

export const fetchSupplierOrders = async (token: string) => {
  return await API.get("/orders/supplier", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const updateOrderStatus = async (orderId: number, token: string) => {
  return await API.put(`/orders/status/supplier/${orderId}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const fetchStoreOwnerOrders = async (storeOwnerId: number) => {
  return await API.get(`/orders/storeOwner/${storeOwnerId}`);
};

export const updateOrderStatusByStoreOwner = async (orderId: number) => {
  return await API.put(`/orders/status/storeOwner/${orderId}`);
};
