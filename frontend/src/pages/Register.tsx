import React, { useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/api/auth/register", {
        username,
        password,
        role,
      });
      alert("User registered successfully");
    } catch (error) {
      alert("Registration failed");
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
      <TextField
        label="Role"
        onChange={(e) => setRole(e.target.value)}
        fullWidth
      />
      <Button onClick={handleRegister}>Register</Button>
    </Box>
  );
};

export default Register;
