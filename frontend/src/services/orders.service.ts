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
  item_id: string;
  amount: number;
}): Promise<void> => {
  await API.post("/orders", orderData);
};
