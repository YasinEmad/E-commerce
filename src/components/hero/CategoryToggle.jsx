import PropTypes from "prop-types";
import { Box, Tabs, Tab, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const categories = {
  English: [
    { label: "Men", value: "men's clothing" },
    { label: "Women", value: "women's clothing" },
    { label: "Jewelery", value: "jewelery" },
    { label: "Electronics", value: "electronics" },
  ],
  العربية: [
    { label: "رجالي", value: "men's clothing" },
    { label: "نسائي", value: "women's clothing" },
    { label: "مجوهرات", value: "jewelery" },
    { label: "إلكترونيات", value: "electronics" },
  ],
};

const CategoryToggle = ({ category, setCategory }) => {
  const theme = useTheme();
  const language = useSelector((state) => state.language.language);
  const tabsRef = useRef(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    if (tabsRef.current) {
      const index = categories[language].findIndex((c) => c.value === category);
      const tabElements = tabsRef.current.querySelectorAll(".MuiTab-root");
      if (tabElements[index]) {
        const { offsetLeft, offsetWidth } = tabElements[index];
        setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      }
    }
  }, [category, language]);

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mb: 4,
      }}
    >
      {/* Full-Width Image */}
      <Box
  sx={{
    width: "100%",
    height: "200px",
    backgroundImage: `url("/images/wave (1).svg")`, // مسار صحيح داخل public
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    borderRadius: "8px",
    overflow: "hidden",
    mb: 4,
  }}
/>



      {/* Category Toggle */}
           {/* Category Toggle */}  
           <Box
        sx={{
          position: "absolute",
          top: "70%", // يجعله في منتصف الصورة
          left: "50%",
          transform: "translate(-50%, -50%)", // يضبطه ليكون في المنتصف تمامًا
          maxWidth: 500,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: theme.shadows[6],
          bgcolor: theme.palette.background.paper,
        }}
      >

        <Tabs
          ref={tabsRef}
          value={category}
          onChange={(_, newValue) => setCategory(newValue)}
          centered
          textColor="primary"
          TabIndicatorProps={{ style: { display: "none" } }}
          sx={{
            "& .MuiTabs-scroller": {
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
            },
            "& .MuiTab-root": {
              textTransform: "capitalize",
              fontWeight: "bold",
              fontSize: "1rem",
              color: theme.palette.text.secondary,
              transition: "color 0.3s ease, transform 0.2s ease",
              "&:hover": {
                color: theme.palette.primary.main,
                transform: "scale(1.1)",
              },
              minWidth: "unset",
              padding: "12px 16px",
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
            },
          }}
        >
          {categories[language].map(({ label, value }) => (
            <Tab key={value} label={label} value={value} />
          ))}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            style={{
              position: "absolute",
              bottom: 0,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              height: "4px",
              background: theme.palette.primary.main,
              borderRadius: "2px",
              zIndex: 1,
            }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

CategoryToggle.propTypes = {
  category: PropTypes.string.isRequired,
  setCategory: PropTypes.func.isRequired,
};

export default CategoryToggle;