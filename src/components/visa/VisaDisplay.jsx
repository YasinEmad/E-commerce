    import PropTypes from 'prop-types'; // Import PropTypes
    import { QRCodeSVG } from "qrcode.react";
    import { motion } from "framer-motion";
    import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Paper,
    Divider,
    } from "@mui/material";
    import { Download, CreditCard } from "@mui/icons-material";

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

    // Check if this visa is the most recently created one based on localStorage
    const isLastCreated = (visaData) => {
        if (!visaData) return false;
        const storedVisaData = localStorage.getItem("lastCreatedVisa"); // Use the key directly
        if (!storedVisaData) return false;
        try {
            const parsedStoredVisa = JSON.parse(storedVisaData);
            // Check if parsedStoredVisa and its cardId exist before comparing
            return parsedStoredVisa?.cardId === visaData.cardId;
        } catch {
            return false;
        }
    };


    function VisaDisplay({ visaData }) {
    const handleDownload = () => {
        if (!visaData) return;
        // Only include non-sensitive data or data needed for ID in the download
        const dataToDownload = {
            cardId: visaData.cardId,
            cardHolderName: visaData.cardHolderName,
            cardNumberLast4: visaData.cardNumber?.slice(-4) ?? 'N/A', // Safe navigation
            expiryDate: visaData.expiryDate,
            cardType: visaData.cardType,
            issueDate: visaData.issueDate,
            creationDate: visaData.creationDate,
            // DO NOT include full card number, cvv, password, or balance
        };
        const visaJson = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([visaJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${visaData.cardId}_info.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!visaData) {
        return (
        <motion.div variants={itemVariants}>
            <Card
            component={Paper}
            elevation={3}
            sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                minHeight: 400,
                p: 3
            }}
            >
            <CreditCard sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
            <Typography
                variant="h6"
                color="textSecondary"
                align="center"
                >
                سيظهر هنا تفاصيل البطاقة بعد إنشائها بنجاح.
                </Typography>
                <Typography
                variant="body1"
                color="textSecondary"
                align="center"
                sx={{mt: 1}}
                >
                {/* Use " for double quotes */}
                املأ النموذج على اليسار وانقر على إنش البطاقة الآن
                </Typography>
            </Card>
        </motion.div>
        );
    }

    // If visaData exists, render the details
    return (
        <motion.div
        variants={itemVariants}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        >
        <Card
            component={Paper}
            elevation={3}
            sx={{ bgcolor: "success.light", color: 'white' }}
        >
            <CardContent>
            <Typography
                variant="h6"
                component="h2"
                gutterBottom
                sx={{ mb: 3, fontWeight: 'bold' }}
            >
                {isLastCreated(visaData)
                ? "تم إنشاء البطاقة بنجاح!"
                : "عرض البطاقة المحفوظة مؤخرًا"}
            </Typography>

            <Box
                sx={{
                p: 3,
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 3,
                color: 'text.primary', // Reset color for inner box
                }}
            >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    <CreditCard sx={{ verticalAlign: 'bottom', mr: 1}}/>
                    تفاصيل البطاقة الهامة
                </Typography>
                <Typography variant="body2" color="error" sx={{ mb: 2, fontWeight:'bold' }}>
                    مهم: احتفظ بمعرف البطاقة وكلمة المرور للدفع لاحقاً!
                </Typography>

                <Grid container spacing={1.5}>
                <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }} noWrap>
                    معرف البطاقة (للدفع):
                    </Typography>
                    <Typography variant="body1" sx={{ fontFamily: 'monospace', letterSpacing: '1px', userSelect:'all', p: 1, bgcolor: 'grey.200', borderRadius: 1 }} noWrap>
                    {visaData.cardId}
                    </Typography>
                </Grid>
                    <Grid item xs={12}>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        كلمة المرور:
                    </Typography>
                        <Typography variant="body1" sx={{ fontFamily: 'monospace', userSelect:'all', p: 1, bgcolor: 'grey.200', borderRadius: 1 }}>
                        {visaData.password} {/* Show password here briefly after creation */}
                        </Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                        (هذه هي المرة الوحيدة التي ستظهر فيها هنا، احفظها!)
                        </Typography>
                    </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <Box component="span" fontWeight="bold">اسم الحامل:</Box> {visaData.cardHolderName}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1" noWrap>
                    <Box component="span" fontWeight="bold">رقم البطاقة:</Box> {visaData.cardNumber}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <Box component="span" fontWeight="bold">CVV:</Box> {visaData.cvv}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <Box component="span" fontWeight="bold">الرصيد:</Box> {visaData.balance?.toFixed(2) ?? 'N/A'} ر.س
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <Box component="span" fontWeight="bold">تاريخ الانتهاء:</Box> {visaData.expiryDate}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                    <Box component="span" fontWeight="bold">الحالة:</Box> {visaData.status === "active" ? "نشطة" : "غير نشطة"}
                    </Typography>
                </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                <QRCodeSVG
                    value={JSON.stringify({ // QR Code: Only essential/safe info
                        cardId: visaData.cardId,
                        cardHolderName: visaData.cardHolderName,
                        cardType: visaData.cardType,
                        expiryDate: visaData.expiryDate,
                    })}
                    size={128} // Slightly smaller
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="Q" // Error correction level
                />
                <Typography variant="caption" display="block" textAlign="center" color="textSecondary" sx={{ mt: 1 }}>
                    امسح الرمز لبيانات تعريفية (لا يحتوي كلمة المرور أو الرصيد)
                </Typography>
                </Box>

                <motion.div whileHover={{ scale: 1.03 }}>
                <Button
                    variant="outlined" // Use outlined for secondary action
                    color="secondary"
                    fullWidth
                    startIcon={<Download />}
                    onClick={handleDownload}
                    sx={{ mt: 2 }}
                >
                    تحميل معلومات تعريف البطاقة (JSON)
                </Button>
                </motion.div>
            </Box>
            </CardContent>
        </Card>
        </motion.div>
    );
    }


    // --- Define propTypes ---
    VisaDisplay.propTypes = {
    // visaData can be null or an object with a specific shape.
    // Properties inside are required *if* visaData is provided.
    visaData: PropTypes.shape({
        cardId: PropTypes.string.isRequired,
        cardHolderName: PropTypes.string.isRequired,
        cardNumber: PropTypes.string.isRequired,
        cvv: PropTypes.string.isRequired,
        issueDate: PropTypes.string.isRequired,
        expiryDate: PropTypes.string.isRequired,
        cardType: PropTypes.string.isRequired,
        balance: PropTypes.number.isRequired,
        // dailyLimit: PropTypes.number.isRequired, // Only add if displayed
        password: PropTypes.string.isRequired, // Validated because it's displayed
        status: PropTypes.string.isRequired,
        creationDate: PropTypes.string.isRequired,
        // lastUpdated: PropTypes.string.isRequired, // Only add if displayed
    }) // Note: the shape itself is not required, allowing null
    };

    // --- Define defaultProps ---
    VisaDisplay.defaultProps = {
    visaData: null, // Default value is null when no visa is created/loaded
    };

    export default VisaDisplay;