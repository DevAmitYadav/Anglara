import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Material UI & Icons
import {
  Grid,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { User } from "lucide-react";

// Redux actions
import { loginUserAction } from "../redux/actions/authActions";
import { resetAuthState } from "../redux/slices/authSlice";

// Validation Schema using Zod
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Destructure with alias to match slice property names.
  const { isLoading: loading, error, success, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Local state for UI feedback
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Memoized submit handler
  const onSubmit = useCallback(
    (values) => {
      dispatch(loginUserAction(values));
    },
    [dispatch]
  );

  // Redirect immediately if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user?.role === "Admin") {
          navigate("/categories");
        } else if (user?.role === "Customer") {
          navigate("/customerForm");
        } else {
          navigate("/");
        }
      } catch (e) {
        navigate("/");
      }
    }
  }, [isAuthenticated, navigate]);

  // When login is successful, show success message then redirect after 2 seconds
  useEffect(() => {
    if (success) {
      reset();
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        dispatch(resetAuthState());
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          if (user?.role === "Admin") {
            navigate("/categories");
          } else if (user?.role === "Customer") {
            navigate("/customerForm");
          } else {
            navigate("/");
          }
        } catch (e) {
          navigate("/");
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, reset, dispatch, navigate]);

  // Clear error message after 5 seconds if an error occurs
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetAuthState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // Derive detailed error message from the slice
  const errorMessage =
    typeof error === "string"
      ? error
      : error?.message || "Login failed. Please try again.";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {/* Error Alert */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{errorMessage}</Alert>
          </Grid>
        )}

        {/* Success Alert */}
        {showSuccess && (
          <Grid item xs={12}>
            <Alert severity="success">Login successful!</Alert>
          </Grid>
        )}

        {/* Email Field */}
        <Grid item xs={12}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            {...register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            InputLabelProps={{ style: { color: "black" } }}
          />
        </Grid>

        {/* Password Field with Toggle Visibility */}
        <Grid item xs={12}>
          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            {...register("password")}
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            InputLabelProps={{ style: { color: "black" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12} textAlign="center" sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: "black",
              color: "white",
              "&:hover": { backgroundColor: "#333" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Login"
            )}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <User className="h-4 w-4" />
          </div>
          <span>Login</span>
        </div>
        <Paper elevation={3} sx={{ p: 3 }}>
          <LoginForm />
        </Paper>
      </div>
    </div>
  );
}
