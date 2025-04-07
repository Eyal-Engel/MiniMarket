import { ORDER_STATUSES } from "./order.constant";

export const STATUS_TRANSLATIONS: Record<string, string> = {
  [ORDER_STATUSES.WAITING]: "ממתין",
  [ORDER_STATUSES.PROCESSED]: "הושלמה",
  [ORDER_STATUSES.IN_PROCESS]: "בתהליך",
};
