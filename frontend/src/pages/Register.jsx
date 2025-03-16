import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUserAction } from "../redux/actions/authActions";
import { resetAuthState } from "../redux/slices/authSlice";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, ArrowLeft } from "lucide-react";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";
import { toast } from "react-toastify";


import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Avatar,
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";

// Nested address schema
const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

// Main registration schema
const registerSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, { message: "Phone number is required" }),
    dob: z.string().min(1, { message: "Date of birth is required" }),
    gender: z.enum(["Male", "Female", "Other"]),
    image: z.any().optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(6, { message: "Confirm your password" }),
    role: z.enum(["Customer", "Admin"]).default("Customer"),
    address: addressSchema.optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "Male",
      image: undefined,
      password: "",
      confirmPassword: "",
      role: "Customer",
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
  });

  const onSubmit = (data) => {
    // Data.image is a File object because the controller captures it
    dispatch(registerUserAction(data));
  };

  useEffect(() => {
    if (success) {
        toast.success("Registration successful! Redirecting...", { duration: 3000 });
  
      reset();
      setPreview(null);
      setFileInputKey(Date.now()); // Reset file input field
  
      const timer = setTimeout(() => {
        dispatch(resetAuthState());
      }, 3000);
  
      return () => clearTimeout(timer);
    } else if (error) {
      toast.error(error); 
    }
  }, [success, error, reset, dispatch]);

  return (
<form onSubmit={handleSubmit(onSubmit)}>
  <Grid container spacing={2}>
    {error && (
      <Grid item xs={12}>
        <Alert severity="error">{error}</Alert>
      </Grid>
    )}
    {success && (
      <Grid item xs={12}>
        <Alert severity="success">Registration successful!</Alert>
      </Grid>
    )}

    {/* Name Fields */}
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="First Name"
        {...register("firstName")}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="Last Name"
        {...register("lastName")}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>

    {/* Email */}
    <Grid item xs={12}>
      <TextField
        size="small"
        label="Email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>

    {/* Password Fields */}
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="Password"
        type={showPassword ? "text" : "password"}
        {...register("password")}
        error={!!errors.password}
        helperText={errors.password?.message}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="Confirm Password"
        type={showConfirmPassword ? "text" : "password"}
        {...register("confirmPassword")}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Grid>

    {/* Phone & Date of Birth */}
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="Phone"
        {...register("phone")}
        error={!!errors.phone}
        helperText={errors.phone?.message}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        type="date"
        label="Date of Birth"
        {...register("dob")}
        error={!!errors.dob}
        helperText={errors.dob?.message}
        fullWidth
        InputLabelProps={{ shrink: true, style: { color: "black" } }}
      />
    </Grid>

    {/* Gender & Role (Aligned in the same row) */}
    <Grid item xs={12} sm={6}>
      <Controller
        name="gender"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="Gender"
            {...field}
            error={!!errors.gender}
            helperText={errors.gender?.message}
            fullWidth
            InputLabelProps={{ style: { color: "black" } }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
        )}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <TextField
            select
            label="Role"
            {...field}
            error={!!errors.role}
            helperText={errors.role?.message}
            fullWidth
            InputLabelProps={{ style: { color: "black" } }}
          >
            <MenuItem value="Customer">Customer</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
          </TextField>
        )}
      />
    </Grid>

    {/* Address Fields */}
    <Grid item xs={12}>
      <TextField
        size="small"
        label="Street"
        {...register("address.street")}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="City"
        {...register("address.city")}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="State"
        {...register("address.state")}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="Zip Code"
        {...register("address.zip")}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>
    <Grid item xs={12} sm={6}>
      <TextField
        size="small"
        label="Country"
        {...register("address.country")}
        fullWidth
        InputLabelProps={{ style: { color: "black" } }}
      />
    </Grid>

    {/* Submit Button */}
    <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={loading}
          sx={{
            backgroundColor: "black",
            color: "white",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Register
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Grid>
  </Grid>
</form>


  );
}

export default function RegisterPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem",
        background: "#f7f7f7",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <Button
          onClick={() => window.history.back()}
          startIcon={<ArrowLeft />}
          variant="text"
        >
          Back
        </Button>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <UserPlus
            style={{ height: "24px", width: "24px", margin: "0 auto" }}
          />
          <Typography variant="h5">Register</Typography>
        </div>
        <Paper elevation={3} sx={{ padding: "1rem" }}>
          <RegisterForm />
        </Paper>
      </div>
    </div>
  );
}
