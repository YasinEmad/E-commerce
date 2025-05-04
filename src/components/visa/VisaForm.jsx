import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Typography,
  Alert,
  useTheme,
  FormHelperText,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  DateRange,
  AttachMoney,
  Lock,
  Person,
  CreditCard,
  CalendarToday,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// --- Constants ---
const cardTypes = [
  { value: "debit", label: "بطاقة خصم" },
  { value: "credit", label: "بطاقة ائتمان" },
  { value: "prepaid", label: "بطاقة مسبقة الدفع" },
];

const initialFormData = {
  cardHolderName: "",
  issueDate: new Date().toISOString().split("T")[0], // Keep as string for input value
  expiryDate: "",
  cardType: "debit",
  initialBalance: "",
  dailyLimit: "",
  password: "",
  status: "active", // Assuming this is set backend or fixed
};

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger animation of children
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

// --- Styled Components (Optional but good for complex styles) ---
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2, // Slightly more rounded corners
  boxShadow: theme.shadows[6], // A bit more prominent shadow
  overflow: "hidden", // Ensure content respects border radius
  background: theme.palette.mode === "dark"
    ? `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[900]})`
    : `linear-gradient(145deg, ${theme.palette.background.paper}, ${theme.palette.grey[100]})`, // Subtle gradient background
  transition: "box-shadow 0.3s ease-in-out",
  "&:hover": {
    boxShadow: theme.shadows[10],
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: theme.palette.mode === "dark"
    ? `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`
    : `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.shape.borderRadius * 1.5,
  fontSize: "1.1rem",
  fontWeight: 600,
  textTransform: "none", // Modern buttons often don't use uppercase
  boxShadow: theme.palette.mode === "dark"
    ? `0 3px 5px 2px ${theme.palette.primary.dark}40`
    : `0 3px 5px 2px ${theme.palette.primary.main}40`, // Subtle shadow based on primary color
  transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: theme.palette.mode === "dark"
      ? `0 5px 8px 3px ${theme.palette.primary.dark}60`
      : `0 5px 8px 3px ${theme.palette.primary.main}60`,
    background: theme.palette.mode === "dark"
      ? `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`
      : `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`, // Invert gradient on hover
  },
}));

// --- Component ---
function VisaForm({ onSubmitVisa, initialError }) {
  const [formData, setFormData] = useState(initialFormData);
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(initialError);
  const theme = useTheme(); // Access theme for styling

  // Memoize minimum expiry date to prevent recalculation on every render
  const minExpiryDate = useMemo(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Expiry must be at least tomorrow
    return today.toISOString().split("T")[0];
  }, []);

  useEffect(() => {
    setFormError(initialError);
  }, [initialError]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing in any field
    if (formError) {
      setFormError(null);
    }
  };

  const validateForm = () => {
    const requiredFields = [
      { key: "cardHolderName", label: "اسم حامل البطاقة" },
      { key: "initialBalance", label: "الرصيد الابتدائي" },
      { key: "dailyLimit", label: "الحد اليومي" },
      { key: "password", label: "كلمة المرور" },
      { key: "expiryDate", label: "تاريخ الانتهاء" },
    ];

    const missingFields = requiredFields.filter(
      (field) => !formData[field.key]
    );
    if (missingFields.length > 0) {
      return `يرجى ملء الحقول الإلزامية: ${missingFields
        .map((f) => f.label)
        .join("، ")}`;
    }

    const initialBalanceNum = parseFloat(formData.initialBalance);
    if (isNaN(initialBalanceNum) || initialBalanceNum < 0) {
      return "الرصيد الابتدائي يجب أن يكون رقمًا موجبًا أو صفرًا.";
    }

    const dailyLimitNum = parseFloat(formData.dailyLimit);
    if (isNaN(dailyLimitNum) || dailyLimitNum < 0) {
      return "الحد اليومي يجب أن يكون رقمًا موجبًا أو صفرًا.";
    }
    if (dailyLimitNum > initialBalanceNum && initialBalanceNum > 0) {
      // Warning, not necessarily an error, could be allowed depending on rules
      // console.warn("Warning: Daily limit exceeds initial balance.");
    }

    const expiry = new Date(formData.expiryDate);
    const issue = new Date(formData.issueDate);
    expiry.setHours(0, 0, 0, 0); // Normalize time for comparison
    issue.setHours(0, 0, 0, 0); // Normalize time for comparison

    if (expiry <= issue) {
      return "تاريخ الانتهاء يجب أن يكون بعد تاريخ الإصدار.";
    }

    if (formData.password.length < 6) {
      // Example: add minimum password length
      return "كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.";
    }

    return null; // No errors
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }
    setFormError(null);
    const submissionData = {
      ...formData,
      initialBalance: parseFloat(formData.initialBalance),
      dailyLimit: parseFloat(formData.dailyLimit),
    };
    onSubmitVisa(submissionData);
  };

  return (
    <motion.div // Outer container for overall animation control if needed
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <StyledCard elevation={0}>
        {" "}
        {/* Use styled card, elevation 0 as shadow is handled by styled */}
        <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
          {" "}
          {/* Responsive padding */}
          <motion.div variants={itemVariants}>
            <Typography
              variant="h5" // Slightly larger heading
              component="h2"
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: 600,
                textAlign: "center",
                color: theme.palette.primary.dark,
              }} // Centered, bolder, themed color
            >
              إضافة بطاقة فيزا جديدة
            </Typography>
          </motion.div>
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Alert
                  severity="error"
                  sx={{ mb: 3, borderRadius: theme.shape.borderRadius }} // Rounded alert
                  variant="filled" // Filled looks good for errors
                >
                  {formError}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              {" "}
              {/* Increased spacing */}
              {/* Card Holder Name */}
              <Grid item xs={12} component={motion.div} variants={itemVariants}>
                <TextField
                  fullWidth
                  variant="outlined" // Consistent variant
                  label="اسم حامل البطاقة"
                  name="cardHolderName"
                  value={formData.cardHolderName}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Initial Balance */}
              <Grid
                item
                xs={12}
                sm={6}
                component={motion.div}
                variants={itemVariants}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="الرصيد الابتدائي ($)" 
                  name="initialBalance"
                  type="number"
                  value={formData.initialBalance}
                  onChange={handleChange}
                  required
                  InputProps={{
                    inputProps: { min: 0, step: "0.01" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Daily Limit */}
              <Grid
                item
                xs={12}
                sm={6}
                component={motion.div}
                variants={itemVariants}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="الحد اليومي ($)" 
                  name="dailyLimit"
                  type="number"
                  value={formData.dailyLimit}
                  onChange={handleChange}
                  required
                  InputProps={{
                    inputProps: { min: 0, step: "0.01" },
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoney color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              
              <Grid
                item
                xs={12}
                sm={6}
                component={motion.div}
                variants={itemVariants}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="تاريخ الإصدار"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  required
                  InputLabelProps={{ shrink: true }}
                  disabled 
                  InputProps={{
                    readOnly: true, 
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Expiry Date */}
              <Grid
                item
                xs={12}
                sm={6}
                component={motion.div}
                variants={itemVariants}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="تاريخ الانتهاء"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ shrink: true }}
                  InputProps={{
                    inputProps: { min: minExpiryDate }, 
                    startAdornment: (
                      <InputAdornment position="start">
                        <DateRange color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Card Type */}
              <Grid
                item
                xs={12}
                sm={6}
                component={motion.div}
                variants={itemVariants}
              >
                <FormControl fullWidth required variant="outlined">
                  <InputLabel id="card-type-label">نوع البطاقة</InputLabel>
                  <Select
                    labelId="card-type-label"
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleChange}
                    label="نوع البطاقة"
                    startAdornment={
                      <InputAdornment
                        position="start"
                        sx={{ ml: 1.5, mr: -1, mt: 0.5 }}
                      >
                        {" "}
                        {/* Adjust positioning */}
                        <CreditCard color="action" />
                      </InputAdornment>
                    }
                  >
                    {cardTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {/* Password */}
              <Grid
                item
                xs={12}
                sm={6}
                component={motion.div}
                variants={itemVariants}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  label="كلمة المرور (PIN)"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          onMouseDown={(e) => e.preventDefault()} 
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  aria-describedby="password-helper-text"
                />
                <FormHelperText id="password-helper-text" sx={{ mt: 1 }}>
                  تستخدم عند الدفع. 6 أحرف على الأقل.
                </FormHelperText>
              </Grid>
              {/* Submit Button */}
              <Grid item xs={12} component={motion.div} variants={itemVariants}>
                <GradientButton
                  type="submit"
                  variant="contained" 
                  fullWidth
                  size="large" 
                  sx={{ mt: 2 }} 
                >
                  إنشاء البطاقة الآن
                </GradientButton>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </StyledCard>
    </motion.div>
  );
}

VisaForm.propTypes = {
  onSubmitVisa: PropTypes.func.isRequired,
  initialError: PropTypes.string,
};

VisaForm.defaultProps = {
  initialError: null,
};

export default VisaForm;
