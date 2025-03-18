import { useState } from "react";
import { Paper, InputBase, Select, MenuItem, useTheme, useMediaQuery } from "@mui/material";
import { Search } from "@mui/icons-material";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const HeaderSearch = ({ language }) => {
  const [category, setCategory] = useState("");
  const theme = useTheme();
  const { palette } = theme;
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const categories = {
    English: [
      { label: "All Categories", value: "" },
      { label: "Smartphones", value: "smartphones" },
      { label: "Laptops", value: "laptops" },
      { label: "Fragrances", value: "fragrances" },
      { label: "Home Decoration", value: "home-decoration" },
    ],
    العربية: [
      { label: "كل الفئات", value: "" },
      { label: "هواتف ذكية", value: "smartphones" },
      { label: "لابتوبات", value: "laptops" },
      { label: "عطور", value: "fragrances" },
      { label: "ديكور منزلي", value: "home-decoration" },
    ],
  };

  return (
    <Paper
      sx={{
        display: "flex",
        alignItems: "center",
        borderRadius: "25px",
        paddingX: 2,
        width: isSmallScreen ? "100%" : 600,
        height: 45,
        boxShadow: "none",
        backgroundColor: palette.background.default,
        border: `1px solid ${palette.divider}`,
      }}
      component={motion.div}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Search sx={{ color: palette.text.secondary, marginRight: 1 }} />
      <InputBase
        placeholder={language === "العربية" ? "بحث..." : "Search..."}
        sx={{ flex: 1, color: palette.text.primary }}
      />
      <Select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        displayEmpty
        sx={{
          marginLeft: 1,
          backgroundColor: palette.background.paper,
          borderRadius: "20px",
          height: "35px",
          color: palette.text.primary,
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        }}
      >
        {categories[language].map((cat) => (
          <MenuItem key={cat.value} value={cat.value}>
            {cat.label}
          </MenuItem>
        ))}
      </Select>
    </Paper>
  );
};

HeaderSearch.propTypes = {
  language: PropTypes.string.isRequired,
};

export default HeaderSearch;