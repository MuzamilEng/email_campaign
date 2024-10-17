import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { useGetLogedinUserQuery } from "../store/storeApi";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Paper,
  Typography,
  Avatar,
  Container,
  CircularProgress,
  Fade,
} from "@mui/material";
import { EditRounded as EditIcon, WavingHand as WaveIcon } from "@mui/icons-material";

const Welcome = () => {
  const [userId, setId] = useState();
  const [firstName, setFirstName] = useState("");
  const navigate = useNavigate();
  const { isLoading, data, isError, isSuccess } = useGetLogedinUserQuery(userId);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("token"));
    setId(data?.user?._id);
    setFirstName(data?.user?.firstName || "");
  }, []);

  const handleUpdateProfile = () => {
    localStorage.setItem("userDeffault", JSON.stringify(data));
    navigate("/update-profile");
  };

  if (isLoading) {
    return (
      <Layout>
        <Box
          sx={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg">
        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          {firstName && (
            <Fade in timeout={800}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 6 },
                  borderRadius: 4,
                  textAlign: "center",
                  maxWidth: "600px",
                  width: "100%",
                  background: "linear-gradient(145deg, #ffffff 0%, #f8faff 100%)",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box
                  sx={{
                    mb: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                  }}
                >
                  <Avatar
                    src={data?.profilePicture || "/api/placeholder/120/120"}
                    sx={{
                      width: 120,
                      height: 120,
                      border: 3,
                      borderColor: "primary.main",
                      boxShadow: 2,
                    }}
                  />
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WaveIcon
                      sx={{
                        fontSize: 40,
                        color: "primary.main",
                        animation: "wave 2s infinite",
                        "@keyframes wave": {
                          "0%": { transform: "rotate(0deg)" },
                          "25%": { transform: "rotate(-20deg)" },
                          "75%": { transform: "rotate(20deg)" },
                          "100%": { transform: "rotate(0deg)" },
                        },
                      }}
                    />
                    <Typography
                      variant="h3"
                      sx={{
                        fontWeight: 700,
                        background: "linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)",
                        backgroundClip: "text",
                        textFillColor: "transparent",
                        mb: 1,
                      }}
                    >
                      Welcome back!
                    </Typography>
                  </Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: "text.primary",
                    }}
                  >
                    {data?.firstName || firstName}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "text.secondary",
                      maxWidth: "400px",
                      mb: 2,
                    }}
                  >
                    We're glad to see you again. Would you like to review and update your profile
                    information?
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleUpdateProfile}
                    startIcon={<EditIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      textTransform: "none",
                      fontSize: "1.1rem",
                      fontWeight: 500,
                      boxShadow: 2,
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 3,
                      },
                      transition: "all 0.2s ease-in-out",
                    }}
                  >
                    Update Profile
                  </Button>
                </Box>
              </Paper>
            </Fade>
          )}
        </Box>
      </Container>
    </Layout>
  );
};

export default Welcome;
