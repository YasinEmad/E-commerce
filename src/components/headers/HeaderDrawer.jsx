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
} from "@mui/material";
import { 
  ShoppingCart, 
  Info, 
  Star, 
  ExitToApp, 
  Home, 
  CreditCard 
} from "@mui/icons-material";
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
    visa: isArabic ? "بطاقات الدفع" : "Payment Cards",
    signOut: isArabic ? "تسجيل الخروج" : "Sign Out",
  };

  const menuItems = [
    {
      path: "/",
      icon: <Home fontSize="medium" />,
      text: text.home,
      key: "home"
    },
    {
      path: "/cart",
      icon: <ShoppingCart fontSize="medium" />,
      text: text.cart,
      key: "cart"
    },
    {
      path: "/about",
      icon: <Info fontSize="medium" />,
      text: text.about,
      key: "about"
    },
    {
      path: "/follow-product",
      icon: <Star fontSize="medium" />,
      text: text.followedProducts,
      key: "follow-product"
    },
    {
      path: "/createvisa",
      icon: <CreditCard fontSize="medium" />,
      text: text.visa,
      key: "visa"
    }
  ];

  return (
    <Drawer
      anchor={isArabic ? "right" : "left"}
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
        {menuItems.map((item, index) => (
          <div key={item.key}>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to={item.path}
                onClick={() => toggleDrawer(false)}
                sx={{
                  px: 3,
                  py: 1.5,
                  "&:hover": {
                    backgroundColor: palette.action.hover,
                  },
                }}
                aria-label={item.text}
              >
                <ListItemIcon sx={{ color: palette.primary.main, minWidth: "40px" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "1rem",
                    fontWeight: "medium",
                  }}
                />
              </ListItemButton>
            </ListItem>
            {index < menuItems.length - 1 && <Divider sx={{ my: 1 }} />}
          </div>
        ))}

        <Divider sx={{ my: 1 }} />

        {/* Sign Out */}
        <ListItem disablePadding key="sign-out">
          <ListItemButton
            component={Link}
            to="/auth"
            onClick={() => {
              toggleDrawer(false);
              setUser(null);
              localStorage.removeItem("user");
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

HeaderDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default HeaderDrawer;