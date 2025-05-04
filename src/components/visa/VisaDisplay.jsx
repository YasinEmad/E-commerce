import { useState } from 'react';
import PropTypes from 'prop-types';
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
    Chip,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import {
    Download,
    CreditCard,
    ContentCopy,
    CheckCircle,
    Lock,
    AccessTime,
    Person,
    Payment,
    AccountBalance,
    CalendarToday,
} from "@mui/icons-material";

const cardVariants = {
    hidden: { opacity: 0, scale: 0.92, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 70,
            damping: 15,
            delay: 0.2,
            staggerChildren: 0.08,
            delayChildren: 0.3,
        },
    },
};

const contentVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 12,
        },
    },
};

const qrCodeVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            delay: 0.5,
        },
    },
};

const buttonVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.6, duration: 0.4 },
    },
    hover: {
        scale: 1.03,
        boxShadow: "0px 6px 12px rgba(0,0,0,0.15)",
        transition: { duration: 0.2 },
    },
};

const isLastCreated = (visaData) => {
    if (!visaData) return false;
    const storedVisaData = localStorage.getItem("lastCreatedVisa");
    if (!storedVisaData) return false;
    try {
        const parsedStoredVisa = JSON.parse(storedVisaData);
        return parsedStoredVisa?.cardId && visaData.cardId && parsedStoredVisa.cardId === visaData.cardId;
    } catch {
        return false;
    }
};

const formatCardNumber = (cardNumber) => {
    if (!cardNumber || typeof cardNumber !== 'string' || cardNumber.length < 8) return '**** **** **** ****';
    if (/\D/.test(cardNumber.replace(/\s/g, ''))) return 'Invalid Card Number';
    const cleaned = cardNumber.replace(/\s/g, '');
    const first4 = cleaned.slice(0, 4);
    const last4 = cleaned.slice(-4);
    const middleDigits = cleaned.length > 8 ? cleaned.slice(4, -4).replace(/./g, '•') : '•••• ••••';
    const formattedMiddle = middleDigits.match(/.{1,4}/g)?.join(' ') || '•••• ••••';

    return `${first4} ${formattedMiddle} ${last4}`.trim();
};

function VisaDisplay({ visaData }) {
    const [copiedFields, setCopiedFields] = useState({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleCopy = (field, value) => {
        if (!value) return;
        navigator.clipboard.writeText(value).then(() => {
            setCopiedFields((prev) => ({ ...prev, [field]: true }));
            setTimeout(() => {
                setCopiedFields((prev) => ({ ...prev, [field]: false }));
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    };

    const handleDownload = () => {
        if (!visaData) return;
        const dataToDownload = {
            cardId: visaData.cardId,
            cardHolderName: visaData.cardHolderName,
            cardNumberLast4: visaData.cardNumber?.slice(-4) ?? 'N/A',
            expiryDate: visaData.expiryDate,
            cardType: visaData.cardType,
            issueDate: visaData.issueDate,
            creationDate: visaData.creationDate,
        };
        const visaJson = JSON.stringify(dataToDownload, null, 2);
        const blob = new Blob([visaJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `visa_${visaData.cardHolderName?.replace(/\s+/g, '_') || 'card'}_${visaData.cardNumber?.slice(-4) || 'info'}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    if (!visaData) {
        return (
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
            >
                <Card
                    component={Paper}
                    elevation={4}
                    sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        minHeight: { xs: 350, sm: 400, md: 450 },
                        p: { xs: 2, sm: 3, md: 4 },
                        borderRadius: 3,
                        background: theme.palette.mode === "dark"
                            ? "linear-gradient(145deg, #1a1a1a, #2d2d2d)"
                            : "linear-gradient(145deg, #f0f4f8, #ffffff)",
                        boxShadow: theme.palette.mode === "dark"
                            ? "0 8px 25px rgba(0,0,0,0.2)"
                            : "0 8px 25px rgba(0,0,0,0.04)",
                    }}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{
                            scale: [0.8, 1.05, 1],
                            opacity: [0, 0.8, 1],
                            rotate: [0, -3, 0, 3, 0]
                        }}
                        transition={{ duration: 0.8, ease: "backOut", delay: 0.2 }}
                    >
                        <CreditCard
                            sx={{
                                fontSize: { xs: 60, sm: 70, md: 80 },
                                color: 'grey.300',
                                mb: 3,
                                filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.08))"
                            }}
                        />
                    </motion.div>

                    <Typography
                        variant="h6"
                        color="primary.dark"
                        align="center"
                        sx={{ mb: 1, fontWeight: 600 }}
                    >
                        تفاصيل البطاقة ستظهر هنا
                    </Typography>

                    <Typography
                        variant="body1"
                        color="text.secondary"
                        align="center"
                        sx={{ maxWidth: "85%", mb: 4 }}
                    >
                        أكمل النموذج لإنشاء بطاقتك الجديدة وعرض تفاصيلها.
                    </Typography>

                    <Box sx={{ mt: 'auto', width: "90%" }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 0.5, duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatType: "mirror", repeatDelay: 0.5 }}
                        >
                            <Box sx={{
                                height: 4,
                                background: `linear-gradient(90deg, transparent, ${theme.palette.primary.light}, transparent)`,
                                borderRadius: 2,
                                mx: 'auto'
                            }} />
                        </motion.div>
                    </Box>
                </Card>
            </motion.div>
        );
    }

    const isActive = visaData.status === "active";
    const wasJustCreated = isLastCreated(visaData);

    return (
        <motion.div
            key={visaData.cardId}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
        >
            <Card
                component={Paper}
                elevation={wasJustCreated ? 8 : 6}
                sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    position: "relative",
                    transition: "box-shadow 0.3s ease-in-out, border 0.3s ease-in-out",
                    border: wasJustCreated ? `2px solid ${theme.palette.success.main}` : `2px solid transparent`,
                    boxShadow: wasJustCreated ? `0 0 20px ${theme.palette.success.light}` : theme.shadows[6],
                    bgcolor: theme.palette.mode === "dark" ? "grey.900" : "background.paper",
                }}
            >
                <CardContent sx={{ position: "relative", zIndex: 1, p: { xs: 2, sm: 3 } }}>
                    <motion.div variants={contentVariants}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
                            <Typography
                                variant={isMobile ? "h6" : "h5"}
                                component="h2"
                                sx={{
                                    fontWeight: 700,
                                    color: wasJustCreated ? "success.dark" : "primary.dark",
                                }}
                            >
                                {wasJustCreated
                                    ? "تم إنشاء البطاقة بنجاح! 🎉"
                                    : "تفاصيل البطاقة"}
                            </Typography>

                            <Chip
                                label={isActive ? "نشطة" : "غير نشطة"}
                                color={isActive ? "success" : "default"}
                                size="small"
                                icon={isActive ? <CheckCircle fontSize="small" /> : <AccessTime fontSize="small" />}
                                sx={{ fontWeight: 600, opacity: isActive ? 1 : 0.7 }}
                            />
                        </Box>
                    </motion.div>

                    <motion.div variants={contentVariants}>
                        <Paper
                            elevation={2}
                            sx={{
                                p: { xs: 2, sm: 3 },
                                borderRadius: 2,
                                bgcolor: theme.palette.mode === 'dark' ? 'grey.800' : 'rgba(255, 255, 255, 0.98)',
                                backdropFilter: "blur(3px)",
                            }}
                        >
                            <motion.div
                                variants={contentVariants}
                                whileHover={{
                                    scale: 1.015,
                                    boxShadow: theme.palette.mode === "dark"
                                        ? "0 6px 15px rgba(0, 0, 0, 0.3)"
                                        : "0 6px 15px rgba(0, 0, 0, 0.1)",
                                    transition: { duration: 0.2 }
                                }}
                            >
                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: { xs: 2, sm: 2.5 },
                                        mb: 3,
                                        borderRadius: { xs: 2, sm: 3 },
                                        backgroundImage: theme.palette.mode === "dark"
                                            ? "linear-gradient(135deg, #1e88e5 0%, #0d47a1 100%)"
                                            : "linear-gradient(135deg, #42a5f5 0%, #1e88e5 60%, #0d47a1 100%)",
                                        color: "white",
                                        position: "relative",
                                        overflow: "hidden",
                                        aspectRatio: '1.586 / 1',
                                        maxWidth: { xs: '100%', sm: 400, md: 450 },
                                        mx: 'auto',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        boxShadow: theme.palette.mode === "dark"
                                            ? "0 4px 12px rgba(0,0,0,0.3)"
                                            : "0 4px 12px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    <Box sx={{
                                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.08,
                                        background: "radial-gradient(circle at 100% 0%, rgba(255,255,255,0.2) 0%, transparent 25%), radial-gradient(circle at 0% 100%, rgba(255,255,255,0.2) 0%, transparent 25%)",
                                        pointerEvents: 'none',
                                    }} />

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: 'flex-start', width: '100%' }}>
                                        <CreditCard sx={{ fontSize: { xs: 30, sm: 36 }, opacity: 0.9, mt: '-4px' }} />
                                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                                            {visaData.cardType?.toUpperCase() || "VISA"}
                                        </Typography>
                                    </Box>

                                    <Box sx={{ my: 'auto', px: 1 }}>
                                        <Box sx={{
                                            width: { xs: 40, sm: 50 }, height: { xs: 30, sm: 38 },
                                            bgcolor: "rgba(255, 215, 0, 0.8)", borderRadius: 1, mb: { xs: 1.5, sm: 2 },
                                            backgroundImage: "linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.1) 50%)", backgroundSize: "10px 100%"
                                        }} />
                                        <Typography variant="h6" sx={{
                                            fontFamily: "monospace", letterSpacing: { xs: "1.5px", sm: "2px" }, fontWeight: 600,
                                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' }, textAlign: 'center',
                                            wordBreak: 'break-all', textShadow: "0px 1px 2px rgba(0,0,0,0.2)"
                                        }}>
                                            {formatCardNumber(visaData.cardNumber)}
                                        </Typography>
                                    </Box>

                                    <Box sx={{
                                        display: "flex", justifyContent: "space-between", alignItems: 'flex-end', width: '100%',
                                        fontSize: { xs: "0.8rem", sm: "0.85rem" }
                                    }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: 'inherit', display: 'block', mb: -0.5 }}>
                                                CARD HOLDER
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 'inherit', lineHeight: 1.2 }} noWrap>
                                                {visaData.cardHolderName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ textAlign: 'right' }}>
                                            <Typography variant="caption" sx={{ opacity: 0.8, fontSize: 'inherit', display: 'block', mb: -0.5 }}>
                                                EXPIRES
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 'inherit', lineHeight: 1.2 }}>
                                                {visaData.expiryDate ? new Date(visaData.expiryDate + 'T00:00:00').toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }) : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </motion.div>

                            <Typography variant="h6" sx={{
                                fontWeight: 700, color: "primary.main", mb: 1, mt: 3,
                                display: "flex", alignItems: "center",
                            }}>
                                <Lock sx={{ mr: 1, fontSize: 20 }} />
                                تفاصيل البطاقة الهامة
                            </Typography>

                            <Typography variant="body2" color="error" sx={{
                                mb: 2.5, fontWeight: 500, p: 1.5,
                                bgcolor: theme.palette.mode === "dark"
                                    ? "error.dark"
                                    : "error.lighter",
                                color: theme.palette.mode === "dark"
                                    ? "error.light"
                                    : "error.darker",
                                borderRadius: 1,
                                border: `1px solid ${theme.palette.error.main}`,
                            }}>
                                مهم: احتفظ بمعرف البطاقة وكلمة المرور للدفع لاحقاً! كلمة المرور لن تظهر مرة أخرى.
                            </Typography>

                            <Grid container spacing={2.5}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2, bgcolor: theme.palette.mode === "dark"
                                        ? "grey.800"
                                        : "grey.100", borderRadius: 2, height: '100%' }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600 }} noWrap>
                                                معرف البطاقة (للدفع):
                                            </Typography>
                                            <Tooltip title={copiedFields.cardId ? "تم النسخ!" : "نسخ المعرف"}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCopy("cardId", visaData.cardId)}
                                                        color={copiedFields.cardId ? "success" : "primary"}
                                                        disabled={!visaData.cardId}
                                                    >
                                                        {copiedFields.cardId ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                        <Typography variant="body1" sx={{
                                            fontFamily: "monospace", letterSpacing: 0.5, userSelect: "all",
                                            p: 1, mt: 0.5, bgcolor: "background.paper", borderRadius: 1,
                                            border: "1px dashed grey.300", fontWeight: 500, wordBreak: 'break-all'
                                        }}>
                                            {visaData.cardId || 'غير متوفر'}
                                        </Typography>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Box sx={{ p: 2, bgcolor: "primary.lighter", borderRadius: 2, height: '100%' }}>
                                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                                            <Typography variant="body1" sx={{ fontWeight: 600, color: "primary.darker" }}>
                                                كلمة المرور (PIN):
                                            </Typography>
                                            <Tooltip title={copiedFields.password ? "تم النسخ!" : "نسخ كلمة المرور"}>
                                                <span>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleCopy("password", visaData.password)}
                                                        color={copiedFields.password ? "success" : "primary"}
                                                        disabled={!visaData.password}
                                                    >
                                                        {copiedFields.password ? <CheckCircle fontSize="small" /> : <ContentCopy fontSize="small" />}
                                                    </IconButton>
                                                </span>
                                            </Tooltip>
                                        </Box>
                                        <Typography variant="body1" sx={{
                                            fontFamily: "monospace", userSelect: "all", p: 1, mt: 0.5,
                                            bgcolor: "background.paper", borderRadius: 1,
                                            border: `1px dashed ${theme.palette.primary.light}`, fontWeight: 500,
                                            wordBreak: 'break-all'
                                        }}>
                                            {visaData.password ? '••••••••' : 'غير متوفر'}
                                        </Typography>
                                        <Typography variant="caption" color="primary.dark" display="block" sx={{ mt: 1, fontWeight: 500 }}>
                                            (انسخها الآن! لن تظهر مرة أخرى.)
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Grid item xs={12} sx={{ mt: 3 }}>
                                <Paper elevation={0} sx={{ 
                                    p: { xs: 1.5, sm: 2 }, 
                                    borderRadius: 2, 
                                    bgcolor: theme.palette.mode === "dark" 
                                        ? "background.paper"
                                        : "grey.50",
                                    border: theme.palette.mode === "dark"
                                        ? `1px solid ${theme.palette.divider}`
                                        : "none"
                                }}>
                                    <Grid container spacing={2} rowSpacing={1.5}>
                                        {[
                                            { icon: Person, label: "اسم الحامل", value: visaData.cardHolderName },
                                            { icon: Payment, label: "رقم البطاقة", value: formatCardNumber(visaData.cardNumber) },
                                            { icon: Lock, label: "CVV", value: visaData.cvv ? `••${visaData.cvv.slice(-1)}` : 'N/A' },
                                            { icon: AccountBalance, label: "الرصيد", value: `${visaData.balance?.toFixed(2) ?? 'N/A'} $` },
                                            { icon: CalendarToday, label: "تاريخ الإصدار", value: visaData.issueDate ? new Date(visaData.issueDate + 'T00:00:00').toLocaleDateString() : 'N/A' },
                                            { icon: AccessTime, label: "تاريخ الانتهاء", value: visaData.expiryDate ? new Date(visaData.expiryDate + 'T00:00:00').toLocaleDateString() : 'N/A' },
                                            { icon: CreditCard, label: "نوع البطاقة", value: visaData.cardType },
                                            { icon: CheckCircle, label: "الحالة", value: isActive ? "نشطة" : "غير نشطة", color: isActive ? "success.main" : "text.disabled" },
                                        ].map((item, index) => (
                                            <Grid item xs={12} sm={6} key={index}>
                                                <Box sx={{ 
                                                    display: "flex", 
                                                    alignItems: "center",
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    bgcolor: theme.palette.mode === "dark" 
                                                        ? 'rgba(255, 255, 255, 0.05)'
                                                        : 'rgba(0, 0, 0, 0.02)',
                                                    '&:hover': {
                                                        bgcolor: theme.palette.mode === "dark"
                                                            ? 'rgba(255, 255, 255, 0.1)'
                                                            : 'rgba(0, 0, 0, 0.04)',
                                                    }
                                                }}>
                                                    <item.icon fontSize="small" 
                                                        sx={{ 
                                                            mr: 1.5, 
                                                            color: item.color || (theme.palette.mode === "dark" 
                                                                ? theme.palette.primary.light 
                                                                : theme.palette.primary.main),
                                                            opacity: theme.palette.mode === "dark" ? 0.9 : 1,
                                                            flexShrink: 0 
                                                        }} 
                                                    />
                                                    <Typography 
                                                        variant="body2" 
                                                        component="div" 
                                                        noWrap 
                                                        sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'baseline', 
                                                            gap: 1,
                                                            width: '100%',
                                                            justifyContent: 'space-between'
                                                        }}
                                                    >
                                                        <Box 
                                                            component="span" 
                                                            fontWeight="bold"
                                                            sx={{
                                                                color: theme.palette.mode === "dark"
                                                                    ? theme.palette.grey[300]
                                                                    : theme.palette.grey[800]
                                                            }}
                                                        >
                                                            {item.label}:
                                                        </Box>
                                                        <Box 
                                                            component="span" 
                                                            sx={{ 
                                                                color: theme.palette.mode === "dark"
                                                                    ? theme.palette.grey[400]
                                                                    : theme.palette.grey[700],
                                                                overflow: 'hidden', 
                                                                textOverflow: 'ellipsis',
                                                                fontFamily: item.label === "رقم البطاقة" ? "monospace" : "inherit"
                                                            }}
                                                        >
                                                            {item.value || 'N/A'}
                                                        </Box>
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            </Grid>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
                                <motion.div variants={qrCodeVariants}>
                                    <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2, background: "white" }}>
                                        <QRCodeSVG
                                            value={JSON.stringify({
                                                cardId: visaData.cardId,
                                                cardHolderName: visaData.cardHolderName,
                                                cardType: visaData.cardType,
                                                expiryDate: visaData.expiryDate,
                                            })}
                                            size={isMobile ? 120 : 140}
                                            bgColor="#ffffff"
                                            fgColor="#000000"
                                            level="Q"
                                            includeMargin={true}
                                        />
                                    </Paper>
                                </motion.div>
                                <Typography variant="caption" display="block" textAlign="center" color="text.secondary" sx={{ mt: 1.5 }}>
                                    امسح لبيانات تعريفية (لا يتضمن كلمة المرور أو الرصيد)
                                </Typography>
                            </Box>
                        </Paper>
                    </motion.div>

                    <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            startIcon={<Download />}
                            onClick={handleDownload}
                            disabled={!visaData}
                            sx={{
                                mt: 3, py: 1.2, borderRadius: 2, fontWeight: 600,
                                boxShadow: 2, textTransform: "none", fontSize: "0.95rem",
                            }}
                        >
                            تحميل معلومات البطاقة (JSON آمن)
                        </Button>
                    </motion.div>
                </CardContent>
            </Card>
        </motion.div>
    );
}

VisaDisplay.propTypes = {
    visaData: PropTypes.shape({
        cardId: PropTypes.string,
        cardHolderName: PropTypes.string,
        cardNumber: PropTypes.string,
        cvv: PropTypes.string,
        issueDate: PropTypes.string,
        expiryDate: PropTypes.string,
        cardType: PropTypes.string,
        balance: PropTypes.number,
        password: PropTypes.string,
        status: PropTypes.string,
        creationDate: PropTypes.string,
    })
};

VisaDisplay.defaultProps = {
    visaData: null,
};

export default VisaDisplay;