    import React, { useState } from "react";
    import PropTypes from "prop-types";
    import { motion } from "framer-motion";
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
    } from "@mui/material";
    import {
    Visibility,
    VisibilityOff,
    DateRange,
    AttachMoney,
    Lock,
    Person,
    } from "@mui/icons-material";

    const cardTypes = [
    { value: "debit", label: "بطاقة خصم" },
    { value: "credit", label: "بطاقة ائتمان" },
    { value: "prepaid", label: "بطاقة مسبقة الدفع" },
    ];

    const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
        type: "spring",
        stiffness: 100,
        },
    },
    };

    const initialFormData = {
    cardHolderName: "",
    issueDate: new Date().toISOString().split("T")[0],
    expiryDate: "",
    cardType: "debit",
    initialBalance: "",
    dailyLimit: "",
    password: "",
    status: "active",
    };

    function VisaForm({ onSubmitVisa, initialError }) {
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [formError, setFormError] = useState(initialError);

    React.useEffect(() => {
        setFormError(initialError);
    }, [initialError]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setFormError(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        const requiredFields = [
        "cardHolderName",
        "initialBalance",
        "dailyLimit",
        "password",
        "expiryDate",
        ];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
        setFormError(
            `يرجى ملء جميع الحقول الإلزامية: ${missingFields
            .map((f) => {
                if (f === "cardHolderName") return "اسم حامل البطاقة";
                if (f === "initialBalance") return "الرصيد الابتدائي";
                if (f === "dailyLimit") return "الحد اليومي";
                if (f === "password") return "كلمة المرور";
                if (f === "expiryDate") return "تاريخ الانتهاء";
                return f;
            })
            .join("، ")}`
        );
        return;
        }
        if (
        isNaN(parseFloat(formData.initialBalance)) ||
        parseFloat(formData.initialBalance) < 0
        ) {
        setFormError("الرصيد الابتدائي يجب أن يكون رقمًا موجبًا.");
        return;
        }
        if (
        isNaN(parseFloat(formData.dailyLimit)) ||
        parseFloat(formData.dailyLimit) < 0
        ) {
        setFormError("الحد اليومي يجب أن يكون رقمًا موجبًا.");
        return;
        }
        if (new Date(formData.expiryDate) <= new Date(formData.issueDate)) {
        setFormError("تاريخ الانتهاء يجب أن يكون بعد تاريخ الإصدار.");
        return;
        }

        onSubmitVisa(formData);
    };

    return (
        <motion.div variants={itemVariants}>
        <Card elevation={3}>
            <CardContent>
            {formError && (
                <Alert severity="error" sx={{ mb: 2 }} variant="filled">
                {formError}
                </Alert>
            )}
            <Typography variant="h6" component="h2" gutterBottom sx={{ mb: 3 }}>
                أدخل تفاصيل البطاقة المطلوبة
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    label="اسم حامل البطاقة"
                    name="cardHolderName"
                    value={formData.cardHolderName}
                    onChange={handleChange}
                    required
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <Person />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    label="الرصيد الابتدائي (ر.س)"
                    name="initialBalance"
                    type="number"
                    value={formData.initialBalance}
                    onChange={handleChange}
                    required
                    InputProps={{
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: (
                        <InputAdornment position="start">
                            <AttachMoney />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    label="الحد اليومي (ر.س)"
                    name="dailyLimit"
                    type="number"
                    value={formData.dailyLimit}
                    onChange={handleChange}
                    required
                    InputProps={{
                        inputProps: { min: 0, step: "0.01" },
                        startAdornment: (
                        <InputAdornment position="start">
                            <AttachMoney />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    label="تاريخ الإصدار"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    disabled
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <DateRange />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    label="تاريخ الانتهاء"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                        inputProps: { min: new Date().toISOString().split("T")[0] },
                        startAdornment: (
                        <InputAdornment position="start">
                            <DateRange />
                        </InputAdornment>
                        ),
                    }}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                    <InputLabel id="card-type-label">نوع البطاقة</InputLabel>
                    <Select
                        labelId="card-type-label"
                        name="cardType"
                        value={formData.cardType}
                        onChange={handleChange}
                        label="نوع البطاقة"
                    >
                        {cardTypes.map((type) => (
                        <MenuItem key={type.value} value={type.value}>
                            {type.label}
                        </MenuItem>
                        ))}
                    </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                    fullWidth
                    label="كلمة المرور"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <Lock />
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
                    />
                    <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ mt: 1, display: "block" }}
                    >
                    تستخدم كلمة المرور هذه عند الدفع بهذه البطاقة.
                    </Typography>
                </Grid>

                <Grid item xs={12}>
                    <motion.div
                    whileHover={{ scale: 1.02 }}
                    style={{ width: "100%" }}
                    >
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        size="large"
                        sx={{ py: 1.5, mt: 1, fontSize: "1.1rem" }}
                    >
                        إنشاء البطاقة الآن
                    </Button>
                    </motion.div>
                </Grid>
                </Grid>
            </Box>
            </CardContent>
        </Card>
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