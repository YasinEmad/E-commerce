import { useState, useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Second_header from "./components/headers/Second-header";
import Header1 from "./components/headers/Header1";
import HeroSection from "./components/hero/Hero_section";
import Features from "./components/hero/Feature";
import CategoryToggle from "./components/hero/CategoryToggle";
import ProductList from "./components/Product/ProductList";
import CartPage from './components/cart/CartPage';
import Footer from "./components/Footer";
import AuthForm from "./components/AuthForm";
import About from "./components/About";
import OrderTrackingPage from "./components/followproduct/OrderTracking";

const validCategories = ["men's clothing", "women's clothing", "jewelery", "electronics"];

function App() {
  const [theme, colorMode] = useMode();
  const [category, setCategory] = useState(() => {
    // Retrieve category from local storage, defaulting to the first valid category if not found
    const savedCategory = localStorage.getItem("category");
    return validCategories.includes(savedCategory) ? savedCategory : validCategories[0];
  });
  const [user, setUser] = useState(() => {
    // Retrieve user from local storage, parsing it as JSON
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const location = useLocation();
  const navigate = useNavigate();

  // Define hidden pages where headers and footers should not appear
  const isHiddenPage = ["/auth"].includes(location.pathname);

  useEffect(() => {
    // Redirect to /auth if the user is not logged in
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  // Save category to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("category", category);
  }, [category]);

  // Save user to local storage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Common Header and Sections */}
        {!isHiddenPage && (
          <>
            <Header1 />
            <Second_header />
          </>
        )}

        {/* Routing Configuration */}
        <Routes>
          {/* Auth Page */}
          <Route path="/auth" element={<AuthForm setUser={setUser} />} />

          {/* Home Page */}
          <Route
            path="/"
            element={
              <>
                <HeroSection />
                <Features />
                <CategoryToggle category={category} setCategory={setCategory} />
                <ProductList category={category} />
              </>
            }
          />

          {/* Cart Page */}
          <Route
            path="/cart"
            element={
              <>
                <CartPage />
              </>
            }
          />

          {/* About Page */}
          <Route
            path="/about"
            element={
              <>
                <About />
              </>
            }
          />

          {/* Follow Product Page */}
          <Route
            path="/follow-product"
            element={
              <>
                <OrderTrackingPage />
              </>
            }
          />

          {/* Order Tracking Page */}
          <Route
            path="/order-tracking"
            element={
              <>
                <OrderTrackingPage />
              </>
            }
          />
        </Routes>

        {/* Common Footer */}
        {!isHiddenPage && <Footer />}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;