import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Typography, Grid, Alert } from "@mui/material";
import { CreditCard } from "@mui/icons-material";

import VisaForm from "./VisaForm";
import VisaDisplay from "./VisaDisplay";

const PAYMENT_CARDS_KEY = "paymentCards";
const LAST_CREATED_VISA_KEY = "lastCreatedVisa";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const titleItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const flyingCardVariants = {
  initial: {
    opacity: 0,
    x: "-50%",
    y: "50%",
    scale: 1.5,
    rotate: -15,
  },
  animate: {
    opacity: 1,
    x: "50%",
    y: "50%",
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 50, damping: 10, duration: 0.8 },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.3 },
  },
};

const displayVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } },
};

function CreateVisa() {
  const [createdVisa, setCreatedVisa] = useState(null);
  const [error, setError] = useState(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [showFlyingCard, setShowFlyingCard] = useState(false);

  useEffect(() => {
    const storedVisaData = localStorage.getItem(LAST_CREATED_VISA_KEY);
    if (storedVisaData) {
      try {
        const parsedVisa = JSON.parse(storedVisaData);
        if (parsedVisa && parsedVisa.cardId && parsedVisa.cardNumber && parsedVisa.expiryDate) {
          setCreatedVisa(parsedVisa);
        } else {
          localStorage.removeItem(LAST_CREATED_VISA_KEY);
        }
      } catch {
        localStorage.removeItem(LAST_CREATED_VISA_KEY);
      }
    }
  }, []);

  const generateCardNumber = () => {
    return "4" + Math.random().toString().slice(2, 16).padEnd(15, "0");
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  const handleCreateVisa = (formData) => {
    setError(null);
    setShowFlyingCard(false);

    try {
      const newVisa = {
        id: uuidv4(),
        cardId: `CARD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        cardHolderName: formData.cardHolderName.trim(),
        cardNumber: generateCardNumber(),
        cvv: generateCVV(),
        issueDate: formData.issueDate,
        expiryDate: formData.expiryDate,
        cardType: formData.cardType,
        balance: parseFloat(formData.initialBalance),
        dailyLimit: parseFloat(formData.dailyLimit),
        password: formData.password, // SECURITY WARNING REMAINS
        status: formData.status,
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
          }
        } catch {
          existingCards = [];
        }
      }

      localStorage.setItem(PAYMENT_CARDS_KEY, JSON.stringify([...existingCards, newVisa]));
      localStorage.setItem(LAST_CREATED_VISA_KEY, JSON.stringify(newVisa));

      setCreatedVisa(newVisa);
      setError(null);
      setFormKey(Date.now());

      setShowFlyingCard(true);
      setTimeout(() => {
        setShowFlyingCard(false);
      }, 1200);
    } catch {
      setError("حدث خطأ أثناء حفظ بيانات البطاقة. قد يكون التخزين ممتلئًا أو غير متاح.");
      setShowFlyingCard(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto", position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence>
        {showFlyingCard && (
          <motion.div
            key="flying-card"
            variants={flyingCardVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'absolute',
              top: '40%',
              left: '50%',
              zIndex: 10,
              transformOrigin: 'center center',
              willChange: 'transform, opacity',
            }}
          >
            <CreditCard sx={{ fontSize: { xs: '3rem', md: '5rem' }, color: 'primary.main' }} />
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={titleItemVariants}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}>
            <CreditCard sx={{ verticalAlign: "middle", mr: 1 }} />
            إنشاء بطاقة دفع جديدة
          </Typography>
        </motion.div>

        {error && (
          <motion.div variants={titleItemVariants}>
            <Alert severity="error" sx={{ mb: 3 }} variant="filled">
              {error}
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <VisaForm key={formKey} onSubmitVisa={handleCreateVisa} />
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              key={createdVisa ? createdVisa.cardId : 'no-visa-display'}
              initial="hidden"
              animate="visible"
              variants={displayVariants}
            >
              <VisaDisplay visaData={createdVisa} />
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
}

export default CreateVisa;
