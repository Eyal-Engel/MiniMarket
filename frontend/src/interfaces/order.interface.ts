import { ORDER_STATUSES } from "../constants/order.constant";

export interface IOrder {
  id: number;
  item_id: number;
  supplier_id: number;
  storeOwnerId: number;
  status: (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
  amount: number;
  total_price: number;
  createdAt: string;
  updatedAt: string;
  Item: {
    name: string;
    price: number;
  };
}
