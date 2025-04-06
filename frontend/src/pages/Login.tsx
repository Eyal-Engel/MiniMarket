import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { username, password }
      );
      localStorage.setItem("token", response.data.token); // שימור טוקן
      alert("Logged in successfully");
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <Box>
      <TextField
        label="Username"
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
      />
      <TextField
        label="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button onClick={handleLogin}>Login</Button>
    </Box>
  );
};

export default Login;
