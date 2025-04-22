import { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  useTheme,
  Box, // Import Box for layout
} from "@mui/material";
import { Menu,  } from "@mui/icons-material"; // Import AccountCircle if you uncomment it
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

// Import custom components
import HeaderDrawer from "./HeaderDrawer";
import HeaderSearch from "./HeaderSearch";

export default function Second_header() {
  // State to manage drawer open/close
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Local state for user management (passed to drawer)
  const [, setUser] = useState(null); // Define user state locally

  // Access MUI theme object for consistent styling
  const theme = useTheme();
  const { palette } = theme;

  // Access current language from Redux store
  const language = useSelector((state) => state.language.language);

  // Function to handle opening and closing the drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event && // Add check for event existence
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    // Use React Fragment to render AppBar and Drawer as siblings
    <>
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
            justifyContent: "space-between", // Keep space-between for overall structure
            alignItems: "center",
            minHeight: "70px",
            paddingX: { xs: 1, sm: 2 }, // Adjust padding for smaller screens
          }}
        >
          {/* Left side: Menu Button */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title={language === "العربية" ? "عرض القائمة" : "View Menu"}>
              <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                <IconButton
                  onClick={toggleDrawer(true)}
                  aria-label={language === "العربية" ? "فتح القائمة" : "Open menu"} // Add aria-label for accessibility
                  sx={{
                    color: palette.text.primary,
                    "&:hover": { opacity: 0.8 },
                  }}
                >
                  <Menu />
                </IconButton>
              </motion.div>
            </Tooltip>
          </Box>

          {/* Center: Search Component */}
          {/* Wrap Search in a Box to allow centering and control spacing */}
          <Box sx={{
            flexGrow: 1, // Allows the search box to take up available space
            display: 'flex',
            justifyContent: 'center', // Center the search component within this box
            px: { xs: 1, sm: 2 }, // Add some horizontal padding around search
            maxWidth: '600px', // Optional: constrain max width of search area
            mx: 'auto', // Centers the box itself if needed (along with flexGrow)
           }}>
            <HeaderSearch language={language} />
          </Box>

          {/* Right side: Account Button or Placeholder */}
          <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 48 /* Approx width of IconButton */ }}>
         
             {/* If Account icon is commented out, the minWidth on the Box acts as a spacer */}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer component - Rendered outside AppBar */}
      <HeaderDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        language={language}
        setUser={setUser} // Pass setUser as a prop
      />
    </>
  );
}