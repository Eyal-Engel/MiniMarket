import API from "../api/api";
import { ISupplier } from "../interfaces/supplier.interface";

export const fetchSuppliers = async (): Promise<ISupplier[]> => {
  const response = await API.get("/suppliers");
  return response.data;
};

export const fetchItemsBySupplier = async (
  supplierId: string
): Promise<any[]> => {
  const response = await API.get(`/items/supplier/${supplierId}`);
  return response.data;
};
