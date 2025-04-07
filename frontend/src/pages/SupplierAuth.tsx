import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

const SupplierAuth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    company_name: "",
    representative_name: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    company_name: "",
    representative_name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "company_name":
        if (isRegister && !value) return "שדה חובה";
        break;
      case "representative_name":
        if (isRegister && !value) return "שדה חובה";
        break;
      case "phone":
        if (!value) return "שדה חובה";
        if (!/^\d{10}$/.test(value)) return "מספר טלפון לא תקין";
        break;
      case "password":
        if (!value) return "שדה חובה";
        if (value.length < 6) return "הסיסמה חייבת להיות לפחות 6 תווים";
        break;
      default:
        return "";
    }
    return "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });

    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const newErrors: any = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isRegister) {
        await API.post("/suppliers", {
          company_name: formData.company_name,
          phone: formData.phone,
          representative_name: formData.representative_name,
          password: formData.password,
        });
        toast.success("הרשמה בוצעה בהצלחה!");
      } else {
        const response = await API.post("/login", {
          phone: formData.phone,
          password: formData.password,
        });
        toast.success("התחברות בוצעה בהצלחה!");
        localStorage.setItem("token", response.data.token);
        navigate("/supplier/orders");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "אירעה שגיאה. נסה שוב.";
      toast.error(errorMessage);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100vh",
        direction: "rtl",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            {isRegister ? "הרשמה כספק" : "התחברות כספק"}
          </Typography>
          {isRegister && (
            <TextField
              fullWidth
              label="שם החברה"
              name="company_name"
              value={formData.company_name}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.company_name}
              helperText={errors.company_name}
            />
          )}
          {isRegister && (
            <TextField
              fullWidth
              label="שם הנציג"
              name="representative_name"
              value={formData.representative_name}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.representative_name}
              helperText={errors.representative_name}
            />
          )}
          <TextField
            fullWidth
            label="טלפון"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.phone}
            helperText={errors.phone}
          />
          <TextField
            dir="ltr"
            fullWidth
            label="סיסמה"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleInputChange}
            margin="normal"
            error={!!errors.password}
            helperText={errors.password}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ marginTop: 2 }}
            onClick={handleSubmit}
          >
            {isRegister ? "הרשמה" : "התחברות"}
          </Button>
          <Link
            component="button"
            variant="body2"
            sx={{ marginTop: 2 }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? "כבר יש לך חשבון? התחבר" : "אין לך חשבון? הירשם"}
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default SupplierAuth;
