import { useEffect, useCallback, useMemo } from "react";
import {
  Container,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, setCart } from "../Redux/cartSlice";
import { addOrder } from "../Redux/ordersSlice"; // Import addOrder action
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const theme = useTheme();
  const navigate = useNavigate();

  // Calculate total price of items in the cart
  const totalPrice = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  // Load cart items from local storage when the component mounts
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      dispatch(setCart(savedCart)); // Initialize cart from localStorage
    } catch (error) {
      console.error("Failed to load cart from local storage:", error);
    }
  }, [dispatch]);

  // Save cart items to local storage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (error) {
      console.error("Failed to save cart to local storage:", error);
    }
  }, [cartItems]);

  // Handle removing an item from the cart
  const handleRemoveFromCart = useCallback(
    (item) => {
      dispatch(removeFromCart(item));
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Item removed from cart",
        showConfirmButton: false,
        timer: 2000,
      });
    },
    [dispatch]
  );

  // Handle confirming the purchase
  const handleConfirmBuying = useCallback(() => {
    if (cartItems.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your cart is empty!",
      });
      return;
    }
  
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to confirm your purchase.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const order = {
          id: Date.now().toString(),
          items: cartItems,
          totalPrice: totalPrice,
          status: "Processing",
        };
  
        dispatch(addOrder(order));
        dispatch(setCart([]));
        localStorage.removeItem("cart");
  
        // Toast Notification - بدون خلفية
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Purchase confirmed!",
          showConfirmButton: false,
          timer: 3000,
        });
  
        navigate("/order-tracking");
      }
    });
  }, [cartItems, totalPrice, dispatch, navigate]);
  
  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 4,
        bgcolor: theme.palette.background.default,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
          color="primary"
        >
          Shopping Cart
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </motion.div>
      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h6"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            Your cart is empty. Add items to get started!
          </Typography>
        </motion.div>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <CartItems
              cartItems={cartItems}
              handleRemoveFromCart={handleRemoveFromCart}
              theme={theme}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <OrderSummary
              cartItems={cartItems}
              totalPrice={totalPrice}
              handleConfirmBuying={handleConfirmBuying}
              theme={theme}
            />
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;