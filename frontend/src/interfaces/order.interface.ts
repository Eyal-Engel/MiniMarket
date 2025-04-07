import { ORDER_STATUSES } from "../constants/order.constant";

export interface IOrder {
  id: number;
  itemId: number;
  supplierId: number;
  storeOwnerId: number;
  status: (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];
  amount: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  Item: {
    name: string;
    price: number;
  };
  storeOwner: {
    companyName: string;
    fullname: string;
    phoneNumber: string;
  };
  Supplier: {
    companyName: string;
    representativeName: string;
    phone: string;
  };
}
