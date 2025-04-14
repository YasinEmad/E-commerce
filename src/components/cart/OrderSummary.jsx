import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import emailjs from '@emailjs/browser'; // استيراد EmailJS
import {
  Box,
  Typography,
  Divider,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Paper
} from "@mui/material";
import { motion } from "framer-motion";
import { CreditCard, Lock, ShoppingCartCheckout, Email, VpnKey } from "@mui/icons-material";

// --- مفاتيح localStorage ---
const PAYMENT_CARDS_KEY = "paymentCards";
const LAST_CREATED_VISA_KEY = "lastCreatedVisa"; // اختياري

// --- معرفات EmailJS (تمت إضافتها بناءً على طلبك) ---
const EMAILJS_SERVICE_ID = 'service_dyzjfku';    // معرف الخدمة الخاص بك
const EMAILJS_TEMPLATE_ID = 'template_oi1admq'; // معرف القالب الخاص بك
const EMAILJS_PUBLIC_KEY = 'qYwq_LZ64cUfGJlJM';   // المفتاح العام الخاص بك

// --- خطوات الواجهة ---
const STEPS = {
    PAYMENT_DETAILS: 'PAYMENT_DETAILS',
    VERIFY_CODE: 'VERIFY_CODE',
};

const OrderSummary = ({
  cartItems,
  totalPrice,
  handleConfirmBuying, // سيتم استدعاؤها بعد التحقق الناجح من الرمز
  onVerificationSuccessNavigate, // دالة للانتقال بعد النجاح
  theme,
}) => {
  // --- الحالة (State) ---
  const [cardIdInput, setCardIdInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [paymentError, setPaymentError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(STEPS.PAYMENT_DETAILS);
  const [verificationCode, setVerificationCode] = useState(""); // لتخزين الرمز المُنشأ محلياً (الذي سيتم إرساله)
  const [codeInput, setCodeInput] = useState(""); // حقل إدخال الرمز من المستخدم
  const [codeError, setCodeError] = useState(null);
  const [pendingPaymentData, setPendingPaymentData] = useState(null);

  // --- (اختياري: منطق الملء المسبق) ---
  useEffect(() => {
    const lastVisaData = localStorage.getItem(LAST_CREATED_VISA_KEY);
    if (lastVisaData) {
      try {
        // const lastVisa = JSON.parse(lastVisaData);
        // يمكنك إلغاء التعليق إذا أردت الملء المسبق لمعرف البطاقة
        // if (lastVisa && lastVisa.cardId) {
        //   setCardIdInput(lastVisa.cardId);
        // }
      } catch (e) {
        console.warn("Could not parse lastCreatedVisa for pre-filling:", e);
      }
    }
  }, []);

  // --- الخطوة 1: إرسال تفاصيل الدفع والبريد الإلكتروني ---
  const handlePaymentDetailsSubmit = async (event) => { // جعلها async لاستخدام await
    event.preventDefault();
    setPaymentError(null);
    setIsLoading(true);

    const trimmedCardIdInput = cardIdInput.trim();
    const trimmedEmailInput = emailInput.trim();

    if (!trimmedEmailInput || !/\S+@\S+\.\S+/.test(trimmedEmailInput)) {
        setPaymentError("يرجى إدخال عنوان بريد إلكتروني صالح.");
        setIsLoading(false);
        return;
    }

    try {
      // 1. التحقق من بيانات البطاقة (من localStorage)
      const storedCardsData = localStorage.getItem(PAYMENT_CARDS_KEY);
      if (!storedCardsData) throw new Error("لم يتم العثور على بطاقات دفع محفوظة.");
      let storedCards = JSON.parse(storedCardsData);
      if (!Array.isArray(storedCards)) throw new Error("تنسيق بيانات البطاقات غير صحيح.");

      const cardToUse = storedCards.find(card => card?.cardId === trimmedCardIdInput);
      if (!cardToUse) throw new Error("معرف البطاقة غير صحيح أو غير موجود.");
      if (cardToUse.password !== passwordInput) throw new Error("كلمة المرور غير صحيحة.");
      if (cardToUse.status !== "active") throw new Error(`البطاقة (${trimmedCardIdInput}) غير نشطة.`);
      if (cardToUse.balance < totalPrice) throw new Error(`رصيد البطاقة (${trimmedCardIdInput}) غير كافٍ.`);

      // --- التحقق من البطاقة ناجح ---

      // 2. إنشاء رمز تحقق عشوائي
      const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(generatedCode); // تخزين الرمز للتحقق لاحقًا

      // 3. إعداد بيانات قالب EmailJS (تأكد من تطابق الأسماء مع قالبك)
      const templateParams = {
        user_email: trimmedEmailInput,       // سيرسل هذا إلى الحقل {{user_email}} في القالب
        verification_code: generatedCode,    // سيرسل هذا إلى الحقل {{verification_code}} في القالب
      };

      console.log("محاولة إرسال بريد التحقق إلى:", trimmedEmailInput, "بالرمز:", generatedCode);

      // 4. إرسال البريد الإلكتروني باستخدام EmailJS والمعرفات المحددة
      await emailjs.send(
          EMAILJS_SERVICE_ID,   // <-- معرف الخدمة المُمرر
          EMAILJS_TEMPLATE_ID,  // <-- معرف القالب المُمرر
          templateParams,
          EMAILJS_PUBLIC_KEY    // <-- المفتاح العام المُمرر
      );

      console.log('تم إرسال بريد التحقق بنجاح!');

      // 5. تخزين بيانات الدفع المؤقتة
      setPendingPaymentData({ cardId: trimmedCardIdInput, email: trimmedEmailInput });

      // 6. الانتقال إلى خطوة إدخال الرمز
      setIsLoading(false);
      setCurrentStep(STEPS.VERIFY_CODE);

    } catch (error) {
      console.error("حدث خطأ:", error);
      if (error && typeof error === 'object' && error.text) { // خطأ من EmailJS
         setPaymentError(`فشل إرسال بريد التحقق. تأكد من صحة إعدادات EmailJS وأن القالب والمتغيرات صحيحة. الخطأ: ${error.text}`);
      } else if (error instanceof Error) { // خطأ من التحقق من البطاقة أو غيره
          setPaymentError(error.message);
      } else { // خطأ غير متوقع
          setPaymentError("حدث خطأ غير متوقع أثناء المعالجة. حاول مرة أخرى.");
      }
      setIsLoading(false);
    }
  };

  // --- الخطوة 2: التحقق من الرمز المدخل ---
  const handleCodeVerificationSubmit = (event) => {
      event.preventDefault();
      setCodeError(null);
      setIsLoading(true);

      // تأخير بسيط للمحاكاة (اختياري)
      setTimeout(() => {
        // 1. مقارنة الرمز المدخل بالرمز المخزن
        if (codeInput.trim() === verificationCode) {
            console.log("تم التحقق من الرمز بنجاح.");
            try {
                // 2. استرداد بيانات البطاقات مرة أخرى (للأمان)
                const storedCardsData = localStorage.getItem(PAYMENT_CARDS_KEY);
                if (!storedCardsData) throw new Error("فقدت بيانات البطاقة قبل التحديث النهائي.");
                let storedCards = JSON.parse(storedCardsData);
                if (!Array.isArray(storedCards)) throw new Error("بيانات البطاقة تالفة قبل التحديث النهائي.");

                // 3. **تنفيذ عملية خصم الرصيد الفعلية**
                let finalCardData = null;
                const updatedCards = storedCards.map(card => {
                    if (card.cardId === pendingPaymentData.cardId) {
                        if (card.balance < totalPrice) {
                           throw new Error("تم اكتشاف عدم كفاية الرصيد قبل الخصم النهائي مباشرة.");
                        }
                        finalCardData = {
                            ...card,
                            balance: card.balance - totalPrice,
                            lastUpdated: new Date().toISOString()
                        };
                        return finalCardData;
                    }
                    return card;
                });

                 if (!finalCardData) {
                     throw new Error("لم يتم العثور على البطاقة المراد الخصم منها في التحديث النهائي.");
                 }

                // 4. حفظ بيانات البطاقات المحدثة في localStorage
                localStorage.setItem(PAYMENT_CARDS_KEY, JSON.stringify(updatedCards));

                // 5. (اختياري) تحديث LAST_CREATED_VISA_KEY إذا تطابقت
                const lastVisaData = localStorage.getItem(LAST_CREATED_VISA_KEY);
                if (lastVisaData) {
                    try {
                        let lastVisa = JSON.parse(lastVisaData);
                        if(lastVisa && lastVisa.cardId === finalCardData.cardId) {
                            lastVisa.balance = finalCardData.balance; // استخدم الرصيد الجديد
                            lastVisa.lastUpdated = finalCardData.lastUpdated;
                            localStorage.setItem(LAST_CREATED_VISA_KEY, JSON.stringify(lastVisa));
                            console.log("Updated lastCreatedVisa balance as well.");
                        }
                    } catch(e) {
                        console.warn("Could not update lastCreatedVisa balance:", e);
                    }
                }

                // 6. استدعاء الدالة الأصلية لتأكيد الشراء
                handleConfirmBuying({
                    cardId: finalCardData.cardId,
                    amountPaid: totalPrice,
                    remainingBalance: finalCardData.balance,
                    email: pendingPaymentData.email // تمرير البريد الإلكتروني
                });

                // 7. استدعاء دالة الانتقال (المُمررة عبر props)
                if (onVerificationSuccessNavigate) {
                    onVerificationSuccessNavigate();
                } else {
                    console.warn("OrderSummary: لم يتم توفير دالة onVerificationSuccessNavigate.");
                }

                setIsLoading(false);

            } catch(error) {
                 console.error("خطأ أثناء إتمام عملية الدفع النهائية:", error);
                 setCodeError(`فشل إتمام الدفع النهائي: ${error.message}. يرجى المحاولة مرة أخرى.`);
                 setIsLoading(false);
            }

        } else {
            // --- الرمز غير متطابق ---
            console.log("فشل التحقق من الرمز.");
            setCodeError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
            setIsLoading(false);
        }
      }, 300); // تأخير محاكاة
  }

  // --- واجهة المستخدم (JSX) ---
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 2, sm: 3 },
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          height: "100%",
          display: 'flex',
          flexDirection: 'column',
        }}
      >
         {/* --- العنوان وملخص السلة (دائماً ظاهر) --- */}
        <Typography variant="h5" component="h2" fontWeight="bold" color="primary" textAlign="center" mb={2}>
          <ShoppingCartCheckout sx={{ verticalAlign: 'middle', mr: 1 }} />
          ملخص الطلب {currentStep === STEPS.PAYMENT_DETAILS ? 'والدفع' : 'وتأكيد البريد'}
        </Typography>

        {/* --- عرض عناصر السلة --- */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
           <List disablePadding>
             {cartItems.map((item) => (
              <ListItem
                key={item.id}
                disableGutters
                secondaryAction={
                  <Typography variant="body1" color="text.secondary" fontWeight="medium">
                    {item.price.toFixed(2)} ر.س
                  </Typography>
                }
                sx={{ borderBottom: `1px dashed ${theme.palette.divider}`, py: 1.5 }}
              >
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{ variant: 'body1', color: 'text.primary', textTransform: 'capitalize' }}
                />
              </ListItem>
            ))}
             {cartItems.length === 0 && ( <ListItem><ListItemText primary="سلة التسوق فارغة." align="center" sx={{color: 'text.secondary'}}/></ListItem> )}
           </List>
        </Box>

        {/* --- الإجمالي --- */}
        <Box sx={{ my: 2, textAlign: 'right' }}>
             <Divider sx={{ mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" color="secondary.main">
              الإجمالي: {totalPrice.toFixed(2)} ر.س
            </Typography>
        </Box>

        {/* --- عرض الواجهة بناءً على الخطوة الحالية --- */}

        {/* === الخطوة 1: تفاصيل الدفع والبريد === */}
        {currentStep === STEPS.PAYMENT_DETAILS && (
           <Box component="form" onSubmit={handlePaymentDetailsSubmit} sx={{ mt: 2 }}>
              <Divider sx={{ my: 2, fontWeight: 'bold' }}>
                 <Typography variant="overline" sx={{fontSize: '0.9rem'}}>تفاصيل الدفع وتأكيد البريد</Typography>
               </Divider>
            {/* حقل معرف البطاقة */}
            <TextField fullWidth required label="معرف البطاقة (Card ID)" value={cardIdInput} onChange={(e) => { setCardIdInput(e.target.value); setPaymentError(null); }} margin="normal" disabled={isLoading} InputProps={{ startAdornment: ( <InputAdornment position="start"><CreditCard color={paymentError && paymentError.includes("البطاقة") ? "error" : "action"} /></InputAdornment> ) }} helperText="أدخل المعرف الفريد للبطاقة." error={!!paymentError && paymentError.includes("البطاقة")} sx={{ mb: 1 }}/>
             {/* حقل كلمة المرور */}
             <TextField fullWidth required label="كلمة المرور" type="password" value={passwordInput} onChange={(e) => { setPasswordInput(e.target.value); setPaymentError(null); }} margin="normal" disabled={isLoading} InputProps={{ startAdornment: ( <InputAdornment position="start"><Lock color={paymentError && paymentError.includes("المرور") ? "error" : "action"} /></InputAdornment> ) }} helperText="أدخل كلمة المرور للبطاقة." error={!!paymentError && paymentError.includes("المرور")} sx={{ mb: 1 }}/>
            {/* حقل البريد الإلكتروني */}
             <TextField fullWidth required label="البريد الإلكتروني للتأكيد" type="email" value={emailInput} onChange={(e) => { setEmailInput(e.target.value); setPaymentError(null); }} margin="normal" disabled={isLoading} InputProps={{ startAdornment: ( <InputAdornment position="start"><Email color={paymentError && paymentError.includes("البريد") ? "error" : "action"} /></InputAdornment> ) }} helperText="سيتم إرسال رمز تأكيد إلى هذا البريد." error={!!paymentError && paymentError.includes("البريد")} sx={{ mb: 2 }}/>

             {/* عرض خطأ الدفع/الإرسال */}
             {paymentError && ( <Alert severity="error" sx={{ mt: 1, mb: 2 }} variant="filled">{paymentError}</Alert> )}

             {/* زر إرسال تفاصيل الدفع */}
             <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: "100%", marginTop: "1rem" }}>
                 <Button type="submit" variant="contained" color="primary" fullWidth disabled={isLoading || totalPrice <= 0 || !cardIdInput.trim() || !passwordInput || !emailInput.trim()} size="large" sx={{ py: 1.5, fontSize: "1.1rem", borderRadius: 2, boxShadow: 3, textTransform: "none" }} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <Email />}>
                     {isLoading ? "جاري الإرسال..." : `إرسال رمز التحقق إلى البريد`}
                 </Button>
             </motion.div>
           </Box>
        )}

        {/* === الخطوة 2: إدخال رمز التحقق === */}
        {currentStep === STEPS.VERIFY_CODE && (
             <Box component="form" onSubmit={handleCodeVerificationSubmit} sx={{ mt: 2 }}>
                <Divider sx={{ my: 2, fontWeight: 'bold' }}>
                    <Typography variant="overline" sx={{fontSize: '0.9rem'}}>تأكيد رمز التحقق</Typography>
                </Divider>

                 {/* رسالة توضيحية */}
                 <Alert severity="info" sx={{ mb: 2 }}>
                    تم إرسال رمز تحقق إلى بريدك الإلكتروني (<b>{pendingPaymentData?.email}</b>). يرجى التحقق من صندوق الوارد (وقد يكون في الرسائل غير المرغوب فيها) وإدخال الرمز أدناه.
                 </Alert>

                 {/* حقل إدخال الرمز */}
                 <TextField fullWidth required label="رمز التحقق" value={codeInput} onChange={(e) => { setCodeInput(e.target.value); setCodeError(null); }} margin="normal" disabled={isLoading} InputProps={{ startAdornment: ( <InputAdornment position="start"><VpnKey color={codeError ? "error" : "action"} /></InputAdornment> ) }} helperText="أدخل الرمز المكون من 6 أرقام الذي تم إرساله." error={!!codeError} sx={{ mb: 2 }} inputProps={{ maxLength: 6, inputMode: 'numeric', pattern: '[0-9]*' }} />

                  {/* عرض خطأ الرمز */}
                 {codeError && ( <Alert severity="error" sx={{ mt: 1, mb: 2 }} variant="filled">{codeError}</Alert> )}

                  {/* زر تأكيد الرمز وإتمام الشراء */}
                 <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: "100%", marginTop: "1rem" }}>
                    <Button type="submit" variant="contained" color="success" fullWidth disabled={isLoading || codeInput.length !== 6} size="large" sx={{ py: 1.5, fontSize: "1.1rem", borderRadius: 2, boxShadow: 3, textTransform: "none" }} startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <ShoppingCartCheckout />}>
                         {isLoading ? "جاري التأكيد النهائي..." : `تأكيد الرمز وإتمام الشراء (${totalPrice.toFixed(2)} ر.س)`}
                     </Button>
                 </motion.div>
             </Box>
        )}

      </Paper>
    </motion.div>
  );
};

// --- تعريف أنواع الخصائص (PropTypes) ---
OrderSummary.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalPrice: PropTypes.number.isRequired,
  handleConfirmBuying: PropTypes.func.isRequired, // دالة مطلوبة للتأكيد بعد النجاح
  onVerificationSuccessNavigate: PropTypes.func, // دالة اختيارية للانتقال بعد النجاح
  theme: PropTypes.object.isRequired, // كائن الثيم مطلوب للتنسيق
};

export default OrderSummary;