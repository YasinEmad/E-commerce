import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  Divider,
} from "@mui/material";
import { ShoppingCart, Info, Star, ExitToApp, Home } from "@mui/icons-material";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const HeaderDrawer = ({ drawerOpen, toggleDrawer, language, setUser }) => {
  const theme = useTheme();
  const { palette } = theme;
  const isArabic = language === "العربية";

  const text = {
    home: isArabic ? "الرئيسية" : "Home",
    cart: isArabic ? "السلة" : "Cart",
    about: isArabic ? "معلومات عنا" : "About",
    followedProducts: isArabic ? "منتجات متابعة" : "Followed Products",
    signOut: isArabic ? "تسجيل الخروج" : "Sign Out",
  };

  return (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer(false)}
      PaperProps={{
        sx: {
          width: 280,
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
        },
      }}
    >
      <List sx={{ py: 2 }}>
        {/* Home */}
        <ListItem disablePadding key="home">
          <ListItemButton
            component={Link}
            to="/"
            onClick={() => toggleDrawer(false)}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            }}
            aria-label={text.home}
          >
            <ListItemIcon sx={{ color: palette.primary.main, minWidth: "40px" }}>
              <Home fontSize="medium" />
            </ListItemIcon>
            <ListItemText
              primary={text.home}
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Cart */}
        <ListItem disablePadding key="cart">
          <ListItemButton
            component={Link}
            to="/cart"
            onClick={() => toggleDrawer(false)}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            }}
            aria-label={text.cart}
          >
            <ListItemIcon sx={{ color: palette.primary.main, minWidth: "40px" }}>
              <ShoppingCart fontSize="medium" />
            </ListItemIcon>
            <ListItemText
              primary={text.cart}
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* About */}
        <ListItem disablePadding key="about">
          <ListItemButton
            component={Link}
            to="/about"
            onClick={() => toggleDrawer(false)}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            }}
            aria-label={text.about}
          >
            <ListItemIcon sx={{ color: palette.primary.main, minWidth: "40px" }}>
              <Info fontSize="medium" />
            </ListItemIcon>
            <ListItemText
              primary={text.about}
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Follow Product */}
        <ListItem disablePadding key="follow-product">
          <ListItemButton
            component={Link}
            to="/follow-product"
            onClick={() => toggleDrawer(false)}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            }}
            aria-label={text.followedProducts}
          >
            <ListItemIcon sx={{ color: palette.primary.main, minWidth: "40px" }}>
              <Star fontSize="medium" />
            </ListItemIcon>
            <ListItemText
              primary={text.followedProducts}
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        </ListItem>

        <Divider sx={{ my: 1 }} />

        {/* Sign Out */}
        <ListItem disablePadding key="sign-out">
          <ListItemButton
            component={Link}
            to="/auth"
            onClick={() => {
              toggleDrawer(false);
              setUser(null); // Reset user state
              localStorage.removeItem("user"); // Clear user data from localStorage
              localStorage.removeItem("category");
            }}
            sx={{
              px: 3,
              py: 1.5,
              "&:hover": {
                backgroundColor: palette.action.hover,
              },
            }}
            aria-label={text.signOut}
          >
            <ListItemIcon sx={{ color: palette.primary.main, minWidth: "40px" }}>
              <ExitToApp fontSize="medium" />
            </ListItemIcon>
            <ListItemText
              primary={text.signOut}
              primaryTypographyProps={{
                fontSize: "1rem",
                fontWeight: "medium",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

// PropTypes validation
HeaderDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired, // Ensure setUser is passed as a function
};

export default HeaderDrawer;