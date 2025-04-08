import {
  Box,
  Link,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { showErrorToast, showSuccessToast } from "../utils/toast.utility";
import { loginSupplier, registerSupplier } from "../services/suppliers.service";

const SupplierAuth = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    companyName: "",
    representativeName: "",
  });
  const [errors, setErrors] = useState({
    phone: "",
    password: "",
    companyName: "",
    representativeName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const { exp } = JSON.parse(atob(token.split(".")[1]));
        if (exp * 1000 > Date.now()) {
          navigate("/supplier/orders");
        }
      } catch (error) {
        console.error("Invalid token format", error);
      }
    }
  }, [navigate]);

  const validateField = (name: string, value: string) => {
    if (name === "companyName") {
      if (isRegister && !value) return "שדה חובה";
    } else if (name === "representativeName") {
      if (isRegister && !value) return "שדה חובה";
    } else if (name === "phone") {
      if (!value) return "שדה חובה";
      if (!/^\d{10}$/.test(value)) return "מספר טלפון לא תקין";
    } else if (name === "password") {
      if (!value) return "שדה חובה";
      if (value.length < 6) return "הסיסמה חייבת להיות לפחות 6 תווים";
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
        await registerSupplier({
          companyName: formData.companyName,
          phone: formData.phone,
          representativeName: formData.representativeName,
          password: formData.password,
        });
        showSuccessToast("הרשמה בוצעה בהצלחה!");
      }

      const response = await loginSupplier({
        phone: formData.phone,
        password: formData.password,
      });

      showSuccessToast("התחברות בוצעה בהצלחה!");
      localStorage.setItem("token", response.data.token);

      navigate("/supplier/orders");
    } catch (error: any) {
      showErrorToast(error);
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
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.companyName}
              helperText={errors.companyName}
            />
          )}
          {isRegister && (
            <TextField
              fullWidth
              label="שם הנציג"
              name="representativeName"
              value={formData.representativeName}
              onChange={handleInputChange}
              margin="normal"
              error={!!errors.representativeName}
              helperText={errors.representativeName}
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
