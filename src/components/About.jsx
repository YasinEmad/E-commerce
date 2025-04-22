import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material";
import { useMediaQuery } from "@mui/material";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  Avatar,
  Divider
} from "@mui/material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const About = () => {
  const theme = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const isSmallScreen = useMediaQuery("(max-width: 900px)");
  
  // Get the selected language from Redux
  const language = useSelector((state) => state.language.language);

  // Translations for sections
  const sections = {
    English: [
      {
        icon: <StorefrontIcon fontSize="large" />,
        title: "Online Store",
        text: "We offer a feature-rich e-commerce platform with thousands of products to meet all your shopping needs.",
        color: "#4CAF50"
      },
      {
        icon: <ShoppingCartIcon fontSize="large" />,
        title: "Easy Shopping",
        text: "Our intuitive interface makes shopping simple and enjoyable, with personalized recommendations and quick checkout.",
        color: "#FFC107"
      },
      {
        icon: <LocalShippingIcon fontSize="large" />,
        title: "Fast Delivery",
        text: "We partner with top logistics providers to ensure your purchases arrive quickly and in perfect condition.",
        color: "#2196F3"
      },
      {
        icon: <SupportAgentIcon fontSize="large" />,
        title: "Customer Support",
        text: "Our dedicated support team is available 24/7 to assist with any questions or concerns about your orders.",
        color: "#9C27B0"
      },
    ],
    العربية: [
      {
        icon: <StorefrontIcon fontSize="large" />,
        title: "متجر إلكتروني",
        text: "نقدم منصة تجارة إلكترونية غنية بالميزات مع آلاف المنتجات لتلبية جميع احتياجاتك التسوقية.",
        color: "#4CAF50"
      },
      {
        icon: <ShoppingCartIcon fontSize="large" />,
        title: "تسوق سهل",
        text: "واجهتنا البديهية تجعل التسوق بسيطًا وممتعًا، مع توصيات مخصصة وعملية دفع سريعة.",
        color: "#FFC107"
      },
      {
        icon: <LocalShippingIcon fontSize="large" />,
        title: "توصيل سريع",
        text: "نتعاون مع أفضل مزودي الخدمات اللوجستية لضمان وصول مشترياتك بسرعة وبحالة مثالية.",
        color: "#2196F3"
      },
      {
        icon: <SupportAgentIcon fontSize="large" />,
        title: "دعم العملاء",
        text: "فريق الدعم المخصص لدينا متاح على مدار الساعة طوال أيام الأسبوع للمساعدة في أي أسئلة أو مخاوف بشأن طلباتك.",
        color: "#9C27B0"
      },
    ],
  };

  // Translations for values
  const values = {
    English: [
      {
        title: "Product Quality", 
        text: "We carefully select all products in our catalog to ensure they meet our high standards for quality, durability, and value.",
        color: "#4CAF50"
      },
      {
        title: "Shopping Experience", 
        text: "We constantly improve our platform to provide the smoothest, most intuitive online shopping experience possible.",
        color: "#2196F3"
      },
      {
        title: "Customer Trust", 
        text: "We prioritize secure transactions, transparent policies, and reliable service to build lasting relationships with our customers.",
        color: "#9C27B0"
      }
    ],
    العربية: [
      {
        title: "جودة المنتج", 
        text: "نختار بعناية جميع المنتجات في كتالوجنا لضمان تلبيتها لمعاييرنا العالية للجودة والمتانة والقيمة.",
        color: "#4CAF50"
      },
      {
        title: "تجربة التسوق", 
        text: "نعمل باستمرار على تحسين منصتنا لتوفير تجربة تسوق عبر الإنترنت أكثر سلاسة وبديهية.",
        color: "#2196F3"
      },
      {
        title: "ثقة العملاء", 
        text: "نعطي الأولوية للمعاملات الآمنة والسياسات الشفافة والخدمة الموثوقة لبناء علاقات دائمة مع عملائنا.",
        color: "#9C27B0"
      }
    ]
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } }
  };

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
        pt: 12,
        pb: 8,
        overflow: "hidden"
      }}
      ref={ref}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Grid container spacing={4} alignItems="center" sx={{ mb: 10 }}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
              }}
            >
              <Typography 
                variant="h2" 
                sx={{ 
                  fontWeight: 800,
                  mb: 2,
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                {language === "English" ? "About Our Shop" : "عن متجرنا"}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  mb: 4
                }}
              >
                {language === "English" 
                  ? "Your premier destination for online shopping" 
                  : "وجهتك المفضلة للتسوق عبر الإنترنت"}
              </Typography>
              <Divider sx={{ mb: 4, borderColor: theme.palette.primary.main, borderWidth: 2, width: "60px" }} />
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1.1rem" }}>
                {language === "English" 
                  ? "We've been revolutionizing the online shopping experience since 2015. With thousands of products across multiple categories, competitive prices, and lightning-fast delivery, we're committed to being your go-to e-commerce destination."
                  : "لقد كنا نحدث ثورة في تجربة التسوق عبر الإنترنت منذ عام 2015. مع آلاف المنتجات عبر فئات متعددة وأسعار تنافسية وتسليم سريع، نحن ملتزمون بأن نكون وجهتك المفضلة للتجارة الإلكترونية."}
              </Typography>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              variants={imageVariants}
            >
              <Box 
                component="img"
                src="/images/Ecommerce web page-pana.svg"
                alt="E-commerce Shopping"
                sx={{
                  width: "100%",
                  maxWidth: "500px",
                  filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.1))",
                  mx: "auto",
                  display: "block"
                }}
              />
            </motion.div>
          </Grid>
        </Grid>

        {/* Section Cards */}
        <Grid container spacing={isSmallScreen ? 3 : 4} sx={{ mb: 10 }}>
          {sections[language].map((section, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={cardVariants}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  sx={{ 
                    height: "100%",
                    borderRadius: 4,
                    boxShadow: `0 10px 30px rgba(0,0,0,0.1)`,
                    transition: "all 0.3s ease",
                    overflow: "visible",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: `0 15px 35px rgba(0,0,0,0.15)`,
                    },
                    position: "relative",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: theme.palette.mode === "dark" 
                      ? `linear-gradient(135deg, rgba(40,40,55,0.95), rgba(30,30,45,0.95))` 
                      : `linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,245,255,0.95))`
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: section.color,
                      position: "absolute",
                      top: -20,
                      left: 20,
                      boxShadow: `0 8px 20px ${section.color}50`
                    }}
                  >
                    {section.icon}
                  </Avatar>
                  <CardContent sx={{ pt: 5, px: 3, pb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, mt: 2 }}>
                      {section.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                      {section.text}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Values Section */}
        <Box sx={{ mb: 8 }}>
          <motion.div
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { duration: 0.8 } }
            }}
          >
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700,
                mb: 1,
                textAlign: "center", 
              }}
            >
              {language === "English" ? "Our Shopping Promise" : "وعدنا للتسوق"}
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: theme.palette.text.secondary,
                mb: 6,
                textAlign: "center", 
                maxWidth: "700px",
                mx: "auto"
              }}
            >
              {language === "English" 
                ? "What makes our e-commerce experience stand out from the rest" 
                : "ما يميز تجربة التسوق الإلكتروني لدينا عن البقية"}
            </Typography>
          </motion.div>

          <Grid container spacing={4}>
            {values[language].map((value, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial="hidden"
                  animate={inView ? "visible" : "hidden"}
                  variants={cardVariants}
                  transition={{ delay: 0.2 + index * 0.2 }}
                >
                  <Card 
                    sx={{ 
                      height: "100%",
                      borderRadius: 4,
                      boxShadow: "none",
                      p: 3,
                      background: `linear-gradient(135deg, ${value.color}10, ${value.color}20)`,
                      border: `1px solid ${value.color}30`,
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: `0 10px 30px ${value.color}30`,
                      }
                    }}
                  >
                    <Box 
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: "15px",
                        backgroundColor: value.color,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 3,
                        boxShadow: `0 8px 20px ${value.color}50`
                      }}
                    >
                      <Typography variant="h4" sx={{ color: "#fff", fontWeight: 700 }}>
                        {index + 1}
                      </Typography>
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: value.color }}>
                      {value.title}
                    </Typography>
                    <Typography variant="body1" sx={{ color: theme.palette.text.secondary, lineHeight: 1.7 }}>
                      {value.text}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Shopping Features Section */}
        <Box sx={{ mt: 12, position: "relative" }}>
          {/* Decorative elements */}
          <Box 
            sx={{ 
              position: "absolute", 
              left: "-10%", 
              top: "20%", 
              width: "300px", 
              height: "300px", 
              borderRadius: "50%", 
              background: `radial-gradient(circle, ${theme.palette.primary.main}30 0%, transparent 70%)`,
              zIndex: 0
            }} 
          />
          <Box 
            sx={{ 
              position: "absolute", 
              right: "-5%", 
              bottom: "10%", 
              width: "200px", 
              height: "200px", 
              borderRadius: "50%", 
              background: `radial-gradient(circle, ${theme.palette.secondary.main}30 0%, transparent 70%)`,
              zIndex: 0
            }} 
          />

          <Grid container spacing={4} alignItems="center" sx={{ position: "relative", zIndex: 1 }}>
            <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
              <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={imageVariants}
              >
                <Box 
                  component="img"
                  src="/public/images/cria.png"
                  alt="Mobile Shopping"
                  sx={{
                    width: "100%",
                    maxWidth: "450px",
                    borderRadius: "20px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                    mx: "auto",
                    display: "block"
                  }}
                />
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
              <motion.div
                initial="hidden"
                animate={inView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 0, x: 50 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
                }}
              >
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 800,
                    mb: 2
                  }}
                >
                  {language === "English" ? "Shop Anywhere, Anytime" : "تسوق في أي مكان، في أي وقت"}
                </Typography>
                <Divider sx={{ mb: 4, borderColor: theme.palette.secondary.main, borderWidth: 2, width: "60px" }} />
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: "1.1rem" }}>
                  {language === "English" 
                    ? "Our mobile-friendly website and dedicated app make shopping on the go a breeze. Browse thousands of products, track your orders, and enjoy exclusive mobile-only deals wherever you are."
                    : "موقعنا المتوافق مع الأجهزة المحمولة وتطبيقنا المخصص يجعلان التسوق أثناء التنقل أمراً سهلاً. تصفح آلاف المنتجات وتتبع طلباتك واستمتع بعروض حصرية للجوال فقط أينما كنت."}
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{ 
                      padding: "12px 25px",
                      fontSize: "16px",
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: "#fff",
                      border: "none",
                      borderRadius: "30px",
                      cursor: "pointer",
                      boxShadow: `0 10px 20px ${theme.palette.primary.main}40`
                    }}
                  >
                    {language === "English" ? "Start Shopping" : "ابدأ التسوق"}
                  </motion.button>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default About;