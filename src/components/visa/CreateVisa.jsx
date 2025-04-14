import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { motion, AnimatePresence } from "framer-motion"; // Import AnimatePresence
import { Box, Typography, Grid, Alert } from "@mui/material";
import { CreditCard } from "@mui/icons-material";

// Import the child components
import VisaForm from "./VisaForm";
import VisaDisplay from "./VisaDisplay";

// --- Define Keys for Local Storage ---
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

// Item variant for the title and error message
const titleItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

// Animation variant for the flying card icon
const flyingCardVariants = {
  initial: {
    opacity: 0,
    x: "-50%", // Start roughly in the middle of the form side
    y: "50%",
    scale: 1.5, // Start slightly larger
    rotate: -15,
  },
  animate: {
    opacity: 1,
    x: "50%", // End roughly in the middle of the display side
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

// Animation variant for the VisaDisplay component appearance
const displayVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.5 } } // Slight delay
};

function CreateVisa() {
  const [createdVisa, setCreatedVisa] = useState(null);
  const [error, setError] = useState(null); // Parent-level errors (e.g., storage)
  const [formKey, setFormKey] = useState(Date.now()); // Key to force form reset
  const [showFlyingCard, setShowFlyingCard] = useState(false); // State for animation trigger

  // Load last created visa from localStorage on component mount
  useEffect(() => {
    const storedVisaData = localStorage.getItem(LAST_CREATED_VISA_KEY);
    if (storedVisaData) {
      try {
        const parsedVisa = JSON.parse(storedVisaData);
        if (parsedVisa && parsedVisa.cardId && parsedVisa.cardNumber && parsedVisa.expiryDate) {
          setCreatedVisa(parsedVisa);
          // No flying animation on initial load
        } else {
          console.warn("Invalid/incomplete visa data in localStorage for LAST_CREATED_VISA_KEY, removing.");
          localStorage.removeItem(LAST_CREATED_VISA_KEY);
        }
      } catch (parseError) {
        console.error("Error parsing last created visa from localStorage:", parseError);
        localStorage.removeItem(LAST_CREATED_VISA_KEY); // Remove corrupted data
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- Helper Functions ---
  const generateCardNumber = () => {
    return "4" + Math.random().toString().slice(2, 16).padEnd(15, "0");
  };

  const generateCVV = () => {
    return Math.floor(100 + Math.random() * 900).toString();
  };

  // --- Main Handler for Visa Creation ---
  const handleCreateVisa = (formData) => {
    setError(null);
    setShowFlyingCard(false); // Reset just in case

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

        // --- Save to Local Storage ---
        const storedCardsData = localStorage.getItem(PAYMENT_CARDS_KEY);
        let existingCards = [];
        // ... (rest of the storage logic remains the same) ...
        if (storedCardsData) {
            try {
                const parsed = JSON.parse(storedCardsData);
                if (Array.isArray(parsed)) {
                  existingCards = parsed;
                } else {
                  console.warn("Existing paymentCards data is not an array, overwriting.");
                  existingCards = [];
                }
            } catch(parseErr) {
                console.error("Error parsing existing paymentCards, overwriting.", parseErr);
                existingCards = [];
            }
        }
        localStorage.setItem(
          PAYMENT_CARDS_KEY,
          JSON.stringify([...existingCards, newVisa])
        );
        localStorage.setItem(LAST_CREATED_VISA_KEY, JSON.stringify(newVisa));

        // --- Update State & Trigger Animations/Reset ---
        setCreatedVisa(newVisa); // Update state to display the new visa
        setError(null); // Ensure no error is shown on success
        setFormKey(Date.now()); // Change key to force re-render and reset of VisaForm state

        // *** Trigger the flying card animation ***
        setShowFlyingCard(true);
        // Hide the flying card after animation (adjust timeout based on animation duration)
        setTimeout(() => {
            setShowFlyingCard(false);
        }, 1200); // e.g., 800ms for animation + 400ms buffer

    } catch (storageError) {
      console.error("Error saving to localStorage:", storageError);
      setError("حدث خطأ أثناء حفظ بيانات البطاقة. قد يكون التخزين ممتلئًا أو غير متاح.");
      setShowFlyingCard(false); // Ensure animation state is reset on error
    }
  };

  return (
    // Add position: relative for the absolute positioned animation
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: "auto", position: 'relative', overflow: 'hidden' }}>
      {/* --- Flying Card Animation --- */}
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
              top: '40%', // Adjust vertical start/end position as needed
              left: '50%', // Centered horizontally for x transform origin
              zIndex: 10, // Keep it above other elements
              transformOrigin: 'center center',
              willChange: 'transform, opacity', // Optimize animation performance
            }}
          >
            {/* Larger icon for visibility during animation */}
            <CreditCard sx={{ fontSize: { xs: '3rem', md: '5rem' }, color: 'primary.main' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Content --- */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Page Title */}
        <motion.div variants={titleItemVariants}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
          >
            <CreditCard sx={{ verticalAlign: "middle", mr: 1 }} />
            إنشاء بطاقة دفع جديدة
          </Typography>
        </motion.div>

        {/* Display parent-level errors */}
        {error && (
          <motion.div variants={titleItemVariants}>
            <Alert severity="error" sx={{ mb: 3 }} variant="filled">
              {error}
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={4}>
          {/* --- Form Section --- */}
          <Grid item xs={12} md={6}>
            <VisaForm
              key={formKey} // Reset form when key changes
              onSubmitVisa={handleCreateVisa}
            />
          </Grid>

          {/* --- Display Area --- */}
          <Grid item xs={12} md={6}>
             {/* Wrap VisaDisplay in motion.div for its own animation */}
             {/* Use createdVisa.cardId as key to trigger animation on change */}
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