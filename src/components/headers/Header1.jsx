import { useContext } from "react";
import { useState } from "react";
import { AppBar, Toolbar, IconButton, Box, Menu, MenuItem, Typography, Tooltip } from "@mui/material";
import { Facebook, Twitter, Instagram, Language, DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { ColorModeContext } from "../../theme";
import { useTheme } from "@mui/material/styles";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setLanguage } from "../../components/Redux/languageSlice";

export default function Header1() {
  const colorMode = useContext(ColorModeContext);
  const theme = useTheme();
  const dispatch = useDispatch();
  const language = useSelector((state) => state.language.language);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = (lang) => {
    if (lang) dispatch(setLanguage(lang));
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: theme.palette.background.paper,
        boxShadow: "none",
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "70px", px: { xs: 2, md: 4 } }}>

        {/* الشعار */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <motion.img
            src="/images/shopping-cart-3d-render-icon-removebg-preview.png"
            alt="شعار المتجر"
            style={{ height: 50, cursor: "pointer" }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div whileHover={{ x: 10, opacity: 1 }} initial={{ x: 0, opacity: 0.7 }} transition={{ duration: 0.3 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer", color: theme.palette.mode === "light" ? "#14213d" : "#f7ede2" }}>
              Creative Tech
            </Typography>
          </motion.div>
        </Box>

        {/* الأيقونات */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* زر تبديل الوضع الليلي */}
          <Tooltip title={language === "English" ? "Toggle Dark Mode" : "تبديل الوضع الداكن"}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <IconButton onClick={colorMode.toggleColorMode} sx={{ color: theme.palette.text.primary }}>
                {theme.palette.mode === "light" ? <DarkModeOutlined /> : <LightModeOutlined />}
              </IconButton>
            </motion.div>
          </Tooltip>

          {/* أيقونات التواصل الاجتماعي */}
          {[Facebook, Twitter, Instagram].map((Icon, index) => (
            <motion.div key={index} whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <IconButton sx={{ color: theme.palette.text.primary, "&:hover": { opacity: 0.8 } }}>
                <Icon />
              </IconButton>
            </motion.div>
          ))}

          {/* زر اختيار اللغة */}
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <IconButton sx={{ color: theme.palette.text.primary }} onClick={handleMenuOpen}>
              <Language />
            </IconButton>
          </motion.div>

          {/* قائمة اللغات */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={() => handleMenuClose(null)}
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <MenuItem onClick={() => handleMenuClose("العربية")}>العربية</MenuItem>
            <MenuItem onClick={() => handleMenuClose("English")}>English</MenuItem>
          </Menu>

          {/* عرض اللغة الحالية */}
          {/* <Typography variant="body1" sx={{ fontWeight: "bold", color: theme.palette.text.primary }}>
            {language}
          </Typography> */}

        </Box>
      </Toolbar>
    </AppBar>
  );
}
