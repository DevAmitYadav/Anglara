import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CustomerForm = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const inputProps = {
    readOnly: true,
    style: {
      backgroundColor: "#F7F9FC",
      borderRadius: "8px",
      padding: "10px 14px",
      fontSize: "14px",
      color: "#2C3E50",
      fontWeight: 500,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F0F2F5, #E3E6EB)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          width: "500px",
          borderRadius: "12px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          background: "white",
          textAlign: "center",
        }}
      >
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            fontSize: "0.9rem",
            fontWeight: "bold",
            borderRadius: "6px",
            backgroundColor: "#FFF4E5",
            color: "#D35400",
          }}
        >
          Logged in as <strong>Customer</strong>. Admin access is required for categories.
        </Alert>

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: "#2C3E50",
          }}
        >
          Customer Details
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              value={user?.firstName || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              value={user?.lastName || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              value={user?.email || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              fullWidth
              value={user?.phone || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              fullWidth
              value={user?.dob ? new Date(user.dob).toLocaleDateString() : ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Gender"
              fullWidth
              value={user?.gender || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="City"
              fullWidth
              value={user?.address?.city || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Country"
              fullWidth
              value={user?.address?.country || ""}
              InputProps={inputProps}
            />
          </Grid>

          <Grid item xs={12} sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              sx={{
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: "none",
                background: "#3498DB",
                "&:hover": { background: "#2980B9" },
                boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
              }}
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/");
              }}
            >
              Logout &amp; Try Admin
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
