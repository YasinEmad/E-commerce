// App.js
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
import CreateVisa from "./components/visa/CreateVisa";

const validCategories = ["men's clothing", "women's clothing", "jewelery", "electronics"];

const getStoredCategory = () => {
  try {
    const savedCategory = localStorage.getItem("category");
    return validCategories.includes(savedCategory) ? savedCategory : validCategories[0];
  } catch {
    return validCategories[0];
  }
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

function App() {
  const [theme, colorMode] = useMode();
  const [category, setCategory] = useState(getStoredCategory);
  const [user, setUser] = useState(getStoredUser);
  const location = useLocation();
  const navigate = useNavigate();

  const hiddenPages = ["/auth"];
  const isHiddenPage = hiddenPages.includes(location.pathname);

  useEffect(() => {
    if (!user && location.pathname !== "/auth") {
      navigate("/auth");
    }
  }, [user, navigate, location.pathname]);

  useEffect(() => {
    localStorage.setItem("category", category);
  }, [category]);

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

        {!isHiddenPage && (
          <>
            <Header1 />
            <Second_header />
          </>
        )}

        <Routes>
          <Route path="/auth" element={<AuthForm setUser={setUser} />} />
          <Route path="/" element={
            <>
              <HeroSection />
              <Features />
              <CategoryToggle category={category} setCategory={setCategory} />
              <ProductList category={category} />
            </>
          } />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/follow-product" element={<OrderTrackingPage />} />
          <Route path="/order-tracking" element={<OrderTrackingPage />} />
          <Route path="/createvisa" element={<CreateVisa />} />
        </Routes>

        {!isHiddenPage && <Footer />}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;