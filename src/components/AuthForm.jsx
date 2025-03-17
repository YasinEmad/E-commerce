import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { signInWithGoogle } from "../auth";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
import GoogleIcon from "@mui/icons-material/Google";

const AuthForm = ({ setUser }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData); // Restore user state
      navigate("/"); // Redirect to home if user is already logged in
    }
  }, [setUser, navigate]);

  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = await signInWithGoogle();
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData)); // Persist user data
        setUser(userData);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "translate(-50%, -50%)",
          zIndex: -1,
        }}
      >
        <source
          src="/public/video/6918396_Motion Graphics_Motion Graphic_3840x2160.mp4"
          type="video/mp4"
        />
      </video>

      {/* Transparent Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          zIndex: 0,
        }}
      />

      {/* Login Form */}
      <Container
        maxWidth="xs"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          position: "relative",
          zIndex: 1,
          transform: "translateY(100px)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: "center",
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(6px)",
              width: "100%",
              maxWidth: "350px",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              color="primary"
              gutterBottom
              sx={{ mb: 2, color: "#333" }}
            >
              Welcome To Creative Tech
            </Typography>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ mb: 3, fontSize: "1rem", color: "#555" }}
            >
              Sign in with Google to continue
            </Typography>

            {error && (
              <Alert severity="error" sx={{ width: "100%", mb: 3 }}>
                {error}
              </Alert>
            )}

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  py: 1.5,
                  borderRadius: 6,
                  backgroundColor: "#db4437",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "#c23323" },
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: "1rem",
                  textTransform: "none",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onClick={handleGoogleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <GoogleIcon fontSize="medium" />
                )}
                {loading ? "Signing in..." : "Sign in with Google"}
              </Button>
            </motion.div>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

AuthForm.propTypes = {
  setUser: PropTypes.func.isRequired,
};

export default AuthForm;