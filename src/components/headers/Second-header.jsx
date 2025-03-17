import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { Menu, AccountCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

// Import custom components
import HeaderDrawer from "./HeaderDrawer";
import HeaderSearch from "./HeaderSearch";

export default function Second_header() {
  // State to manage drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Local state for user management
  const [, setUser] = useState(null); // Define user state locally

  // Access MUI theme object for consistent styling
  const theme = useTheme();
  const { palette } = theme;

  // Access current language from Redux store
  const language = useSelector((state) => state.language.language);

  // Function to handle opening and closing the drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <AppBar
      position="static"
      sx={{
        background: palette.background.paper,
        boxShadow: "none",
        borderBottom: `1px solid ${palette.divider}`,
      }}
      component={motion.div}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          minHeight: "70px",
          paddingX: 2,
        }}
      >
        {/* Left side menu button */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Tooltip title={language === "العربية" ? "عرض القائمة" : "View Menu"}>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: palette.text.primary,
                  "&:hover": { opacity: 0.8 },
                }}
              >
                <Menu />
              </IconButton>
            </motion.div>
          </Tooltip>
        </div>

        {/* Drawer component */}
        <HeaderDrawer
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          language={language}
          setUser={setUser} // Pass setUser as a prop
        />

        {/* Search component */}
        <HeaderSearch language={language} />

        {/* Right side account button */}
        <Tooltip title={language === "العربية" ? "الحساب" : "Account"}>
          <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
            <IconButton
              sx={{
                color: palette.text.primary,
                "&:hover": { opacity: 0.8 },
              }}
            >
              <AccountCircle />
            </IconButton>
          </motion.div>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}