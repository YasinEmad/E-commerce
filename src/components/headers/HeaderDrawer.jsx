// src/components/headers/HeaderDrawer.js
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
  Box,         // Added for layout
  Typography,  // Added for potential header
  alpha,       // Added for transparent colors
} from "@mui/material";
import {
  ShoppingCart,
  Info,
  Star,
  ExitToApp,
  Home,
  CreditCard,
  // Consider adding a dedicated icon for the app/brand if available
  // import MenuBookIcon from '@mui/icons-material/MenuBook'; // Example
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom"; // Use NavLink for active styles
import PropTypes from "prop-types";

const HeaderDrawer = ({ drawerOpen, toggleDrawer, language, setUser }) => {
  const theme = useTheme();
  const { palette, shape, spacing } = theme; // Destructure theme properties
  const location = useLocation(); // Get current location for active state
  const isArabic = language === "العربية";

  const text = {
    appName: isArabic ? "criative tech" : "criative tech", // Example App Name
    home: isArabic ? "الرئيسية" : "Home",
    cart: isArabic ? "السلة" : "Cart",
    about: isArabic ? "معلومات عنا" : "About",
    followedProducts: isArabic ? "منتجات متابعة" : "Followed Products",
    visa: isArabic ? "بطاقات الدفع" : "Payment Cards",
    signOut: isArabic ? "تسجيل الخروج" : "Sign Out",
  };

  const menuItems = [
    { path: "/", icon: <Home />, text: text.home, key: "home" },
    { path: "/cart", icon: <ShoppingCart />, text: text.cart, key: "cart" },
    { path: "/about", icon: <Info />, text: text.about, key: "about" },
    {
      path: "/follow-product",
      icon: <Star />,
      text: text.followedProducts,
      key: "follow-product",
    },
    {
      path: "/createvisa",
      icon: <CreditCard />,
      text: text.visa,
      key: "visa",
    },
  ];

  const handleSignOut = () => {
    toggleDrawer(false)(); // Close drawer first
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("category");
    // Navigation to /auth is handled by the NavLink/Link component itself
  };

  // Common styles for list items
  const baseListItemSx = {
    borderRadius: shape.borderRadius * 2, // Nicer rounded corners
    margin: spacing(0.5, 2), // Add some horizontal margin
    padding: spacing(1, 2), // Adjust padding
    transition: theme.transitions.create(['background-color', 'color'], {
        duration: theme.transitions.duration.short,
    }),
    '&:hover': {
      backgroundColor: alpha(palette.primary.main, 0.08), // Subtle primary hover
      color: palette.primary.main,
      '& .MuiListItemIcon-root': { // Change icon color on hover too
        color: palette.primary.main,
      },
    },
  };

  // Styles for the active list item
  const activeListItemSx = {
    backgroundColor: alpha(palette.primary.main, 0.12), // Slightly stronger background for active
    color: palette.primary.main, // Active text color
    fontWeight: 'bold', // Make text bold
    '& .MuiListItemIcon-root': {
      color: palette.primary.main, // Active icon color
    },
     '&:hover': { // Keep hover distinct but related
      backgroundColor: alpha(palette.primary.main, 0.15),
    }
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%', // Ensure Box takes full height
      }}
      role="presentation"
      // onClick={toggleDrawer(false)} // Optional: close drawer on clicking content bg
      // onKeyDown={toggleDrawer(false)} // Optional: close drawer on Escape key
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: spacing(3, 2), // Padding top/bottom=3, left/right=2
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${palette.divider}`, // Subtle separator
        }}
      >
        {/* Optional: App Icon/Logo */}
        {/* <MenuBookIcon sx={{ mr: 1.5, color: palette.primary.main }} /> */}
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: palette.text.primary }}>
          {text.appName}
        </Typography>
      </Box>

      {/* Navigation List */}
      <List sx={{ py: 1, flexGrow: 1 }}> {/* Add padding, allow list to grow */}
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem disablePadding key={item.key}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={toggleDrawer(false)} // Close drawer on click
                sx={{
                  ...baseListItemSx,
                  ...(isActive && activeListItemSx), // Apply active styles conditionally
                }}
                aria-label={item.text}
                aria-current={isActive ? 'page' : undefined} // Accessibility for active page
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto', // Allow icon to be closer to text
                    mr: 1.5, // Margin between icon and text
                    color: isActive ? palette.primary.main : palette.action.active, // Active vs inactive icon color
                    transition: theme.transitions.create('color'), // Smooth color transition
                  }}
                >
                  {/* Clone element to potentially add styles if needed, or just pass icon */}
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "0.95rem", // Slightly smaller font for cleaner look
                    fontWeight: isActive ? 'bold' : 'medium', // Bold for active, medium otherwise
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Divider before Sign Out */}
      <Divider sx={{ mx: 2, my: 1, borderColor: alpha(palette.divider, 0.6) }} />

      {/* Sign Out Section */}
      <List sx={{ py: 1 }}>
        <ListItem disablePadding key="sign-out">
          <ListItemButton
            // Use NavLink here too if /auth should feel like a navigation target
            // Or keep as simple button/link if it's just an action
            component={NavLink} // Use NavLink for consistent styling, even though it's an action
            to="/auth"
            onClick={handleSignOut} // Use dedicated handler
            sx={{
                ...baseListItemSx,
                // Optionally add a different hover/style for sign out
                 '&:hover': {
                    backgroundColor: alpha(palette.error.light, 0.1), // Subtle error color on hover
                    color: palette.error.main,
                    '& .MuiListItemIcon-root': {
                        color: palette.error.main,
                    },
                 },
            }}
            aria-label={text.signOut}
          >
            <ListItemIcon sx={{
                minWidth: 'auto',
                mr: 1.5,
                color: palette.action.active, // Default icon color
                 transition: theme.transitions.create('color'),
            }}>
              <ExitToApp />
            </ListItemIcon>
            <ListItemText
              primary={text.signOut}
              primaryTypographyProps={{
                fontSize: "0.95rem",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Drawer
      anchor={isArabic ? "right" : "left"}
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: { xs: 260, sm: 280 }, // Responsive width
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          borderRight: !isArabic ? `1px solid ${palette.divider}` : 'none', // Subtle border
          borderLeft: isArabic ? `1px solid ${palette.divider}` : 'none',
          boxShadow: theme.shadows[2], // Add a subtle shadow
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
};

HeaderDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default HeaderDrawer;