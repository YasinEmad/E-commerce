import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Typography,
  Grid,
  Alert,
  Paper,
  Container,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  CreditCard,
  AddCircle,
  Check,
  InfoOutlined,
} from "@mui/icons-material";

import VisaForm from "./VisaForm";
import VisaDisplay from "./VisaDisplay";

const PAYMENT_CARDS_KEY = "paymentCards";
const LAST_CREATED_VISA_KEY = "lastCreatedVisa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const titleItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const flyingCardVariants = {
  initial: { y: -200, x: "-50%", opacity: 0, scale: 0.5 },
  animate: {
    y: 0,
    x: "-50%",
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 50, damping: 10, duration: 1 },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3 },
  },
};

const formVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const displayVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.2 } },
};

const successIconVariants = {
  initial: { scale: 0, opacity: 0, rotate: -90 },
  animate: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 150, damping: 10, delay: 0.1 },
  },
  exit: {
    scale: 0.5,
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

const placeholderVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.5 } },
};

function CreateVisa() {
  const [createdVisa, setCreatedVisa] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formKey, setFormKey] = useState(Date.now());
  const [showFlyingCard, setShowFlyingCard] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    const storedVisaData = localStorage.getItem(LAST_CREATED_VISA_KEY);
    if (storedVisaData) {
      try {
        const parsedVisa = JSON.parse(storedVisaData);
        if (
          parsedVisa?.cardId &&
          parsedVisa?.cardNumber &&
          parsedVisa?.expiryDate
        ) {
          setCreatedVisa(parsedVisa);
        } else {
          console.warn("Stored visa data is invalid, removing.");
          localStorage.removeItem(LAST_CREATED_VISA_KEY);
        }
      } catch (e) {
        console.error("Failed to parse stored visa data:", e);
        localStorage.removeItem(LAST_CREATED_VISA_KEY);
      }
    }
  }, []);

  const generateCardNumber = () => {
    let cardNumber = "4";
    for (let i = 0; i < 15; i++) {
      cardNumber += Math.floor(Math.random() * 10);
      if ((i + 1) % 4 === 3 && i < 14) {
        cardNumber += " ";
      }
    }
    return cardNumber;
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const handleCreateVisa = useCallback(async (formData) => {
    setError(null);
    setLoading(true);
    setShowFlyingCard(false);
    setShowSuccess(false);

    try {
      const newVisa = {
        id: uuidv4(),
        cardId: `VC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cardHolderName: formData.cardHolderName.trim(),
        cardNumber: generateCardNumber(),
        cvv: generateCVV(),
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        cardType: formData.cardType,
        balance: parseFloat(formData.initialBalance) || 0,
        dailyLimit: parseFloat(formData.dailyLimit) || 0,
        password: formData.password,
        status: formData.status || "active",
        creationDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      const storedCardsData = localStorage.getItem(PAYMENT_CARDS_KEY);
      let existingCards = [];
      if (storedCardsData) {
        try {
          const parsed = JSON.parse(storedCardsData);
          if (Array.isArray(parsed)) {
            existingCards = parsed;
          } else {
            console.warn(
              "Stored payment cards data is not an array, resetting."
            );
          }
        } catch (e) {
          console.error("Failed to parse existing cards data:", e);
          setError(
            "فشل في قراءة بيانات البطاقات الحالية، سيتم إنشاء قائمة جديدة."
          );
          existingCards = [];
        }
      }

      localStorage.setItem(
        PAYMENT_CARDS_KEY,
        JSON.stringify([...existingCards, newVisa])
      );
      localStorage.setItem(LAST_CREATED_VISA_KEY, JSON.stringify(newVisa));

      setCreatedVisa(newVisa);
      setFormKey(Date.now());

      setShowFlyingCard(true);
      setTimeout(() => {
        setShowFlyingCard(false);
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      }, 1500);
    } catch (err) {
      console.error("Error creating or saving visa:", err);
      setError(
        err.message ||
          "حدث خطأ غير متوقع أثناء إنشاء البطاقة. يرجى المحاولة مرة أخرى."
      );
      setShowFlyingCard(false);
      setShowSuccess(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const mainPaperStyle = {
    position: "relative",
    overflow: "hidden",
    borderRadius: "16px",
    backgroundColor: theme.palette.mode === "dark" 
      ? 'rgba(30, 30, 35, 0.9)'
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: "blur(10px)",
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.palette.mode === "dark"
      ? "0 10px 30px rgba(0,0,0,0.3)"
      : "0 10px 30px rgba(0,0,0,0.1)",
  };

  const topBorderStyle = {
    height: "6px",
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
    borderTopLeftRadius: "16px",
    borderTopRightRadius: "16px",
  };

  const sectionPaperStyle = {
    padding: theme.spacing(3),
    borderRadius: "12px",
    backgroundColor: theme.palette.mode === "dark"
      ? 'rgba(45, 45, 50, 0.95)'
      : 'rgba(255, 255, 255, 0.95)',
    boxShadow: theme.palette.mode === "dark"
      ? "0 4px 15px rgba(0,0,0,0.2)"
      : "0 4px 15px rgba(0,0,0,0.05)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  const placeholderStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
    minHeight: "200px",
    textAlign: "center",
    color: theme.palette.text.secondary,
    p: 3,
  };

  return (
    <Box>
      <Container maxWidth="xl">
        <Paper elevation={8} sx={mainPaperStyle}>
          <Box sx={topBorderStyle} />
          <Box
            sx={{
              position: "absolute",
              top: isMediumScreen ? "15%" : "10%",
              left: 0,
              right: 0,
              height: "200px",
              zIndex: 10,
              pointerEvents: "none",
              overflow: "visible",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <AnimatePresence>
              {showFlyingCard && (
                <motion.div
                  key="flying-card"
                  variants={flyingCardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{ position: "relative" }}
                >
                  <CreditCard
                    sx={{
                      fontSize: { xs: "4rem", md: "5rem" },
                      color: theme.palette.primary.main,
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  key="success-indicator"
                  variants={successIconVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 11,
                  }}
                >
                  <Check
                    sx={{
                      fontSize: { xs: "4.5rem", md: "5.5rem" },
                      color: theme.palette.success.main,
                      background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${theme.palette.success.light} 60%, rgba(76,175,80,0) 100%)`,
                      borderRadius: "50%",
                      padding: "8px",
                      boxShadow: "0 0 15px rgba(76,175,80,0.5)",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          <Box sx={{ p: { xs: 3, md: 4 }, pt: { xs: 4, md: 5 } }}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <motion.div variants={titleItemVariants}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <CreditCard
                    color="primary"
                    sx={{ fontSize: "2rem", mr: 1.5 }}
                  />
                  <Typography
                    variant={isMobile ? "h5" : "h4"}
                    component="h1"
                    gutterBottom
                    sx={{ fontWeight: 700, textAlign: "center" }}
                  >
                    إنشاء بطاقة دفع جديدة
                  </Typography>
                </Box>
                <Divider
                  sx={{ mb: 3, bgcolor: "primary.light", height: "2px" }}
                />
              </motion.div>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
                    variants={titleItemVariants}
                    style={{ marginBottom: theme.spacing(3) }}
                    role="alert"
                    aria-live="assertive"
                  >
                    <Alert
                      severity="error"
                      variant="filled"
                      sx={{ borderRadius: 2 }}
                    >
                      {error}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
              <Grid container spacing={isMobile ? 3 : 4} alignItems="stretch">
                <Grid item xs={12} md={6}>
                  <motion.div
                    variants={formVariants}
                    style={{ height: "100%" }}
                  >
                    <Paper sx={sectionPaperStyle}>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mb: 2.5 }}
                      >
                        <AddCircle color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          تفاصيل البطاقة الجديدة
                        </Typography>
                      </Box>
                      <VisaForm
                        key={formKey}
                        onSubmitVisa={handleCreateVisa}
                        isLoading={loading}
                        initialError={null}
                      />
                    </Paper>
                  </motion.div>
                </Grid>
                <Grid item xs={12} md={6}>
                  <motion.div
                    key={
                      createdVisa
                        ? `display-${createdVisa.cardId}`
                        : "display-placeholder"
                    }
                    variants={displayVariants}
                    style={{ height: "100%" }}
                  >
                    <Paper sx={sectionPaperStyle}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2.5,
                          px: { xs: 2, sm: 3 },
                          pt: { xs: 2, sm: 3 },
                        }}
                      >
                        <CreditCard color="secondary" sx={{ mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          معاينة البطاقة المنشأة
                        </Typography>
                      </Box>

                      <AnimatePresence mode="wait">
                        {createdVisa ? (
                          <motion.div
                            key="visa-card-content"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            style={{
                              flexGrow: 1,
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              paddingBottom: theme.spacing(
                                isMediumScreen ? 0 : 3
                              ),
                              minHeight: isMediumScreen ? "300px" : "auto",
                            }}
                          >
                            <VisaDisplay visaData={createdVisa} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder-content"
                            variants={placeholderVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0 }}
                            style={{ flexGrow: 1 }}
                          >
                            <Box sx={placeholderStyle}>
                              <InfoOutlined
                                sx={{
                                  fontSize: "3rem",
                                  mb: 1,
                                  color: "grey.400",
                                }}
                              />
                              <Typography variant="body1">
                                ستظهر معاينة البطاقة هنا بعد إتمام عملية الإنشاء
                                بنجاح.
                              </Typography>
                              <Typography variant="caption" sx={{ mt: 0.5 }}>
                                املأ النموذج على اليسار واضغط على زر الإنشاء.
                              </Typography>
                            </Box>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Paper>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default CreateVisa;