import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Container,
  Typography,
  Grid,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TableContainer,
  Skeleton,
  // Removed Button import as it's no longer used for actions
  Chip,
  Tooltip as 
  Alert,
  Snackbar,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import {
  Legend,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CancelIcon from "@mui/icons-material/Cancel";
// Removed DeleteIcon as it's no longer used
// Removed updateOrderStatusAsync as handleCancelOrder is removed
import {
  fetchOrders,
  // updateOrderStatusAsync, // Removed as handleCancelOrder is removed
  selectOrders,
  selectOrdersStatus,
  selectOrdersError
} from "../Redux/ordersSlice"; // Assuming setOrders was a mistake and not intended

// Styled components for table
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
    transition: "background-color 0.2s ease-in-out",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5),
  fontSize: "0.9rem",
}));

const OrderTrackingPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const status = useSelector(selectOrdersStatus);
  const error = useSelector(selectOrdersError);
  const language = useSelector((state) => state.language.language);
  const isLoading = status === 'loading';
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  const showMessage = (message, severity = "success") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  useEffect(() => {
    if (error) {
      // Still show fetch errors
      showMessage(error, "error");
    }
  }, [error]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const getStatusLabel = (status) => {
    if (language === "العربية") {
      switch (status) {
        case "Delivered":
          return "تم التوصيل";
        case "Pending":
          return "قيد الانتظار";
        case "Shipped":
          return "تم الشحن";
        case "Cancelled":
          return "ملغى";
        default:
          return status;
      }
    }
    return status;
  };

  const getOriginalStatus = (translatedStatus) => {
    if (language === "العربية") {
      switch (translatedStatus) {
        case "تم التوصيل":
          return "Delivered";
        case "قيد الانتظار":
          return "Pending";
        case "تم الشحن":
          return "Shipped";
        case "ملغى":
          return "Cancelled";
        default:
          return translatedStatus;
      }
    }
    return translatedStatus;
  };

  const getStatusChip = (status, language) => {
    const label = language === "العربية" ? getStatusLabel(status) : status;
    switch (status) {
      case "Delivered":
        return <Chip icon={<CheckCircleIcon />} label={label} color="success" size="small" />;
      case "Pending":
        return <Chip icon={<PendingIcon />} label={label} color="warning" size="small" />;
      case "Shipped":
        return <Chip icon={<LocalShippingIcon />} label={label} color="primary" size="small" />;
      case "Cancelled":
        return <Chip icon={<CancelIcon />} label={label} color="error" size="small" />;
      default:
        return <Chip label={label} size="small" />;
    }
  };

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  // Removed handleCancelOrder function as the button is removed
  /*
  const handleCancelOrder = async (orderId, itemId) => {
    try {
      await dispatch(updateOrderStatusAsync({
        orderId,
        itemId,
        status: "Cancelled"
      })).unwrap();
      showMessage(language === "العربية" ? "تم إلغاء الطلب بنجاح" : "Order cancelled successfully");
    } catch (error) {
      showMessage(error.message, "error");
    }
  };
  */

  // Removed handleRemoveItem function as the button is removed
  /*
  const handleRemoveItem = (orderId, itemId) => {
    // This logic should ideally happen via a Redux action/reducer or API call
    // Directly modifying the state like this is not typical Redux pattern
    // const updatedOrders = orders.map((order) =>
    //   order.id === orderId
    //     ? {
    //         ...order,
    //         items: order.items.filter((item) => item.id !== itemId),
    //       }
    //     : order
    // );
    // Assuming `setOrders` was a placeholder/mistake, removing this logic.
    // dispatch(setOrders(updatedOrders)); // setOrders is not defined/imported
    console.warn("Remove item functionality removed.");
  };
  */

  // Calculate status counts based on fetched orders
  const statusCounts = orders.reduce((acc, order) => {
    order.items.forEach((item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
    });
    return acc;
  }, {});

  const chartData = Object.keys(statusCounts).map((status, index) => ({
    name: getStatusLabel(status),
    value: statusCounts[status],
    fill: COLORS[index % COLORS.length],
  }));

  // Calculate product revenue based on fetched orders
  const productRevenueData = orders
    .flatMap((order) => order.items)
    .reduce((acc, item) => {
      // Only include items that haven't been cancelled for revenue calculation? Optional.
      // if (item.status !== 'Cancelled') {
         acc[item.title] = (acc[item.title] || 0) + item.price * item.quantity;
      // }
      return acc;
    }, {});

  const barChartData = Object.keys(productRevenueData).map((product) => ({
    name: product,
    revenue: productRevenueData[product],
  }));

  const STATUS_ICONS = {
    Delivered: <CheckCircleIcon style={{ color: "#00C49F" }} />,
    Pending: <PendingIcon style={{ color: "#FFBB28" }} />,
    Shipped: <LocalShippingIcon style={{ color: "#0088FE" }} />,
    Cancelled: <CancelIcon style={{ color: "#FF8042" }} />,
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", p: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight="bold" color="primary">
          {language === "العربية" ? "تتبع الطلب" : "Order Tracking"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
      </motion.div>
      {isLoading ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} />
          </Grid>
        </Grid>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
            {language === "العربية" ? "لا يوجد لديك طلبات لتتبعها." : "You have no orders to track."}
          </Typography>
        </motion.div>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper} elevation={3} sx={{ maxHeight: 500, overflow: "auto" }}>
              <Table stickyHeader aria-label="order tracking table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>{language === "العربية" ? "المنتج" : "Product"}</StyledTableCell>
                    <StyledTableCell align="right">{language === "العربية" ? "السعر" : "Price"}</StyledTableCell>
                    <StyledTableCell align="right">{language === "العربية" ? "الكمية" : "Quantity"}</StyledTableCell>
                    <StyledTableCell align="right">{language === "العربية" ? "المجموع" : "Total"}</StyledTableCell>
                    <StyledTableCell align="right">{language === "العربية" ? "حالة المنتج" : "Product Status"}</StyledTableCell>
                    {/* Changed Header for the last column */}
                    <StyledTableCell align="right">{language === "العربية" ? "ملاحظات" : "Notes"}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) =>
                    order.items.map((item) => (
                      <StyledTableRow key={`${order.id}-${item.id}`}> {/* Ensure unique key if item IDs aren't globally unique */}
                        <StyledTableCell component="th" scope="row">
                          {item.title}
                        </StyledTableCell>
                        <StyledTableCell align="right">${item.price.toFixed(2)}</StyledTableCell>
                        <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                        <StyledTableCell align="right">${(item.price * item.quantity).toFixed(2)}</StyledTableCell>
                        <StyledTableCell align="right">
                          {getStatusChip(item.status, language)}
                        </StyledTableCell>
                        {/* Replaced Buttons with the requested text */}
                        <StyledTableCell align="right">
                          <Typography variant="body2" color="text.secondary">
                             {language === "العربية" ? "الطلب في الطريق" : "Order is on the way"} {/* Added translation */}
                          </Typography>
                        </StyledTableCell>
                      </StyledTableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                p={3}
                bgcolor="background.paper"
                borderRadius={3}
                boxShadow={5}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="h6" fontWeight="bold" color="secondary" mb={2} textAlign="center">
                  {language === "العربية" ? "توزيع حالة الطلب" : "Order Status Distribution"}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    />
                    <Tooltip />
                    <Legend
                      formatter={(value) => {
                        // Use original status for icons if available
                        const originalStatus = getOriginalStatus(value);
                        const icon = STATUS_ICONS[originalStatus] || null;
                        return (
                          <span>
                            {icon} {value}
                          </span>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box
                p={3}
                bgcolor="background.paper"
                borderRadius={3}
                boxShadow={5}
                sx={{ border: "1px solid", borderColor: "divider" }}
              >
                <Typography variant="h6" fontWeight="bold" color="secondary" mb={2} textAlign="center">
                  {/* Updated Bar Chart Title based on data */}
                  {language === "العربية" ? "إيرادات المنتج" : "Product Revenue"}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  {/* Added check for barChartData length */}
                  {barChartData.length > 0 ? (
                    <BarChart data={barChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="revenue" fill="#82ca9d" name={language === "العربية" ? "الإيرادات" : "Revenue"}/>
                    </BarChart>
                  ) : (
                    <Typography variant="body1" textAlign="center" color="text.secondary">
                       {language === "العربية" ? "لا توجد بيانات إيرادات لعرضها." : "No revenue data to display."}
                    </Typography>
                  )}
                </ResponsiveContainer>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      )}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default OrderTrackingPage;