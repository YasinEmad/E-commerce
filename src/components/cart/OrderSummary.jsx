import PropTypes from "prop-types";
import { Box, Typography, Divider, Button } from "@mui/material";
import { motion } from "framer-motion";

const OrderSummary = ({ cartItems, totalPrice, handleConfirmBuying, theme }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        p={3}
        bgcolor={theme.palette.background.paper}
        borderRadius={3}
        boxShadow={5}
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          height: "fit-content",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          textAlign="center"
          mb={2}
        >
          Order Summary
        </Typography>
        {cartItems.map((item) => (
          <Box
            key={item.id}
            display="flex"
            justifyContent="space-between"
            p={1}
            borderBottom={1}
            borderColor="divider"
            sx={{ alignItems: "center" }}
          >
            <Typography
              variant="body1"
              color="text.primary"
              sx={{ textTransform: "capitalize" }}
            >
              {item.title}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              ${item.price.toFixed(2)}
            </Typography>
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
        <Typography
          variant="h5"
          fontWeight="bold"
          color="secondary"
          textAlign="right"
        >
          Total: ${totalPrice.toFixed(2)}
        </Typography>
      </Box>
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", marginTop: "1rem" }}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            py: 1.5,
            fontSize: "1.1rem",
            borderRadius: 3,
            boxShadow: 5,
            textTransform: "capitalize",
          }}
          onClick={handleConfirmBuying}
        >
          Confirm Buying
        </Button>
      </motion.div>
    </motion.div>
  );
};

OrderSummary.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
  totalPrice: PropTypes.number.isRequired,
  handleConfirmBuying: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default OrderSummary;