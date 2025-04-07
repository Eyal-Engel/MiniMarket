import { toast } from "react-toastify";
import { ERROR_TRANSLATIONS } from "../constants/error.constant";

export const showErrorToast = (error: any) => {
  let errorMessage = "שגיאה לא ידועה. אנא נסה שוב.";

  console.log(error.response.data?.message);
  // בדיקה אם השגיאה היא מסוג Axios
  if (error.response && error.response.status) {
    const statusCode = error.response.status;
    const serverMessage = error.response.data?.message;

    // טיפול בשגיאה דינמית של מלאי חסר
    if (serverMessage?.startsWith("Not enough stock available.")) {
      const availableStockMatch = serverMessage.match(/Available stock: (\d+)/);
      const availableStock = availableStockMatch ? availableStockMatch[1] : "0";
      errorMessage = `אין מספיק מלאי זמין. כמות זמינה: ${availableStock}`;
    }
    // טיפול בשגיאה דינמית של כמות מינימלית
    else if (serverMessage?.startsWith("Amount must be at least")) {
      const minimumAmountMatch = serverMessage.match(/at least (\d+)/);
      const minimumAmount = minimumAmountMatch ? minimumAmountMatch[1] : "0";
      errorMessage = `הכמות חייבת להיות לפחות ${minimumAmount}`;
    }
    // טיפול בשגיאה "Supplier not found."
    else if (serverMessage === "Supplier not found.") {
      errorMessage = "ספק לא קיים במערכת";
    }
    // טיפול בשגיאה "Invalid credentials"
    else if (
      serverMessage ===
      "Invalid credentials. Please check your phone number or password."
    ) {
      errorMessage =
        "הפרטים שהוזנו אינם תקינים. אנא בדוק את מספר הטלפון או הסיסמה.";
    } else {
      // תרגום הודעת השגיאה אם קיימת
      errorMessage =
        ERROR_TRANSLATIONS[serverMessage] ||
        ERROR_TRANSLATIONS[`Request failed with status code ${statusCode}`] ||
        serverMessage ||
        errorMessage;
    }
  } else if (error.message) {
    // תרגום הודעת שגיאה כללית
    errorMessage = ERROR_TRANSLATIONS[error.message] || error.message;
  }

  // הצגת הודעת השגיאה ב-Toastify
  toast.error(errorMessage);
};
export const showSuccessToast = (message: string) => {
  toast.success(message);
};
