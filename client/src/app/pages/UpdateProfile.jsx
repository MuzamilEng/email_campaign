import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import {
  CameraAlt as Camera,
  Person as User,
  Email as Mail,
  Phone,
  CardMembership as CardIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import Layout from "../Layout/Layout";
import { useUpdateProfileMutation } from "../store/storeApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [defaultUser, setDefaultUser] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      penCardNumber: "",
    },
  });

  const [updateProfile, { isLoading, isError, isSuccess, data }] = useUpdateProfileMutation();

  const onSubmit = (data) => {
    updateProfile({ id: defaultUser?._id, ...data });
  };

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userDeffault"));
    if (userData && userData) {
      setDefaultUser(userData);
      reset(userData);
    }
  }, [reset]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Profile updated successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      navigate("/welcome");
    }
    if (isError) {
      toast.error("Error updating profile", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [isSuccess, isError]);

  return (
    <Layout>
      <Box
        sx={{
          minHeight: "100vh",
          py: 6,
          px: 3,
          backgroundColor: "#f8fafc",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            maxWidth: "800px",
            mx: "auto",
            borderRadius: 2,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardHeader
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              py: 3,
            }}
            title={
              <Typography variant="h5" fontWeight="bold">
                Update Profile
              </Typography>
            }
            subheader={
              <Typography sx={{ color: "primary.contrastText", opacity: 0.8 }}>
                Manage your profile information
              </Typography>
            }
          />

          <CardContent sx={{ p: 4 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Profile Picture Section */}
              <Box sx={{ mb: 4, textAlign: "center" }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      border: 3,
                      borderColor: "primary.main",
                    }}
                    src={defaultUser?.profilePicture || "/api/placeholder/120/120"}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: 5,
                      right: 5,
                      backgroundColor: "primary.main",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                      boxShadow: 2,
                    }}
                    size="small"
                  >
                    <Camera fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }}>
                <Typography color="textSecondary" variant="body2">
                  Personal Information
                </Typography>
              </Divider>

              <Grid container spacing={3}>
                {/* First Name */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        InputProps={{
                          startAdornment: <User sx={{ mr: 1, color: "primary.main" }} />,
                        }}
                        error={!!errors.firstName}
                        helperText={errors.firstName ? errors.firstName.message : ""}
                      />
                    )}
                  />
                </Grid>

                {/* Last Name */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        InputProps={{
                          startAdornment: <User sx={{ mr: 1, color: "primary.main" }} />,
                        }}
                        error={!!errors.lastName}
                        helperText={errors.lastName ? errors.lastName.message : ""}
                      />
                    )}
                  />
                </Grid>

                {/* Email */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Email"
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Mail sx={{ mr: 1, color: "primary.main" }} />,
                        }}
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    )}
                  />
                </Grid>

                {/* Phone Number */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^[0-9+-]+$/,
                        message: "Invalid phone number",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: "primary.main" }} />,
                        }}
                        error={!!errors.phoneNumber}
                        helperText={errors.phoneNumber ? errors.phoneNumber.message : ""}
                      />
                    )}
                  />
                </Grid>

                {/* Pen Card Number */}
                <Grid item xs={12}>
                  <Controller
                    name="penCardNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Pen Card Number"
                        variant="outlined"
                        InputProps={{
                          startAdornment: <CardIcon sx={{ mr: 1, color: "primary.main" }} />,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </form>
          </CardContent>

          <Divider />

          <CardActions sx={{ justifyContent: "flex-end", p: 3 }}>
            <Button href="/welcome"
              variant="outlined"
              sx={{
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "medium",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit(onSubmit)}
              sx={{
                px: 4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "medium",
                boxShadow: 2,
              }}
            >
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </CardActions>
        </Paper>
      </Box>
    </Layout>
  );
};

export default UpdateProfile;
