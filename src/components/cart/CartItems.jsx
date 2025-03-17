import PropTypes from "prop-types";
import { Grid, Card, CardContent, CardMedia, Typography, Button, Box } from "@mui/material";
import { motion } from "framer-motion";

const CartItems = ({ cartItems, handleRemoveFromCart, theme }) => {
  return (
    <Grid container spacing={3}>
      {cartItems.map((item) => (
        <Grid item xs={12} sm={6} key={item.id}>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          >
            <Card
              sx={{
                boxShadow: 5,
                borderRadius: 3,
                p: 1,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                maxWidth: 250,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardMedia
                component="img"
                height="120"
                image={item.image}
                alt={item.title} // استخدام title بدلاً من name
                sx={{ borderRadius: 2 }}
              />
              <CardContent sx={{ py: 1, flexGrow: 1 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  textAlign="center"
                  color="primary"
                  sx={{ textTransform: "capitalize" }}
                >
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mt={0.5}
                >
                  ${item.price.toFixed(2)}
                </Typography>
              </CardContent>
              <Box sx={{ mt: "auto" }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10,
                  }}
                >
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    sx={{
                      mt: 1,
                      borderRadius: 3,
                      fontSize: "0.8rem",
                      py: 0.75,
                      textTransform: "capitalize",
                    }}
                    onClick={() => handleRemoveFromCart(item)}
                  >
                    Remove
                  </Button>
                </motion.div>
              </Box>
            </Card>
          </motion.div>
        </Grid>
      ))}
    </Grid>
  );
};

CartItems.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      // name: PropTypes.string.isRequired, // إزالة name
    })
  ).isRequired,
  handleRemoveFromCart: PropTypes.func.isRequired,
  theme: PropTypes.object.isRequired,
};

export default CartItems;