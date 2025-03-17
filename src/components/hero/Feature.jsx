import { Box, Typography, useTheme, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { ShoppingCart, Store, Payment, LocalShipping } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Features = () => {
  const theme = useTheme();
  const language = useSelector((state) => state.language.language);

  const features = {
    English: [
      {
        icon: <ShoppingCart fontSize="large" />,
        title: "Easy Shopping",
        description: "Browse and purchase products effortlessly.",
      },
      {
        icon: <Store fontSize="large" />,
        title: "Wide Variety",
        description: "Explore a vast range of categories and brands.",
      },
      {
        icon: <Payment fontSize="large" />,
        title: "Secure Payments",
        description: "Fast and safe checkout with multiple options.",
      },
      {
        icon: <LocalShipping fontSize="large" />,
        title: "Fast Delivery",
        description: "Get your orders delivered on time.",
      },
    ],
    العربية: [
      {
        icon: <ShoppingCart fontSize="large" />,
        title: "تسوق سهل",
        description: "تصفح واشترِ المنتجات بكل سهولة.",
      },
      {
        icon: <Store fontSize="large" />,
        title: "تنوع واسع",
        description: "استكشف مجموعة كبيرة من الفئات والعلامات التجارية.",
      },
      {
        icon: <Payment fontSize="large" />,
        title: "مدفوعات آمنة",
        description: "إتمام سريع وآمن للشراء مع خيارات متعددة.",
      },
      {
        icon: <LocalShipping fontSize="large" />,
        title: "توصيل سريع",
        description: "استلم طلباتك في الوقت المحدد.",
      },
    ],
  };

  return (
    <Box
      p={3} // Reduced padding
      bgcolor={theme.palette.background.default}
      sx={{
        borderRadius: 4,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {features[language].map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.95 }}
              style={{ perspective: "1000px" }}
            >
              <Box
                textAlign="center"
                bgcolor={theme.palette.background.paper}
                color={theme.palette.text.primary}
                p={3} // Reduced padding
                borderRadius={8}
                boxShadow="0px 6px 20px rgba(0, 0, 0, 0.1)"
                height="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  "&:hover": {
                    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.15)",
                    transform: "translateY(-5px)",
                    transition: "all 0.3s ease",
                  },
                  minHeight: 200, // Reduced min height
                }}
              >
                <Box
                  mb={2}
                  sx={{
                    backgroundColor: "#f5f5f5", // Light background for contrast
                    color: "#4a5759", // Changed icon color
                    borderRadius: "50%",
                    width: 56, // Reduced size
                    height: 56, // Reduced size
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  color={theme.palette.text.secondary}
                  textAlign="center"
                  sx={{ lineHeight: 1.6 }}
                >
                  {feature.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Features;