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
  Button,
  Chip,
  Tooltip as MuiTooltip,
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
import DeleteIcon from "@mui/icons-material/Delete";
import { setOrders } from "../Redux/ordersSlice";

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
  const orders = useSelector((state) => state.orders.orders);
  const language = useSelector((state) => state.language.language);
  const [isLoading, setIsLoading] = useState(true);

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
    let savedOrders = [];
    try {
      savedOrders = JSON.parse(localStorage.getItem("orders")) || [];
    } catch (error) {
      console.error("Failed to parse orders:", error);
      localStorage.removeItem("orders");
    }
    dispatch(setOrders(savedOrders));
    setIsLoading(false);
  }, [dispatch]);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Failed to save orders:", error);
    }
  }, [orders]);

  const handleCancelOrder = (orderId, itemId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            items: order.items.map((item) =>
              item.id === itemId ? { ...item, status: "Cancelled" } : item
            ),
          }
        : order
    );
    dispatch(setOrders(updatedOrders));
  };

  const handleRemoveItem = (orderId, itemId) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            items: order.items.filter((item) => item.id !== itemId),
          }
        : order
    );
    dispatch(setOrders(updatedOrders));
  };

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

  const productRevenueData = orders
    .flatMap((order) => order.items)
    .reduce((acc, item) => {
      acc[item.title] = (acc[item.title] || 0) + item.price * item.quantity;
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
                    <StyledTableCell align="right">{language === "العربية" ? "إجراء" : "Action"}</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) =>
                    order.items.map((item) => (
                      <StyledTableRow key={item.id}>
                        <StyledTableCell component="th" scope="row">
                          {item.title}
                        </StyledTableCell>
                        <StyledTableCell align="right">${item.price.toFixed(2)}</StyledTableCell>
                        <StyledTableCell align="right">{item.quantity}</StyledTableCell>
                        <StyledTableCell align="right">${(item.price * item.quantity).toFixed(2)}</StyledTableCell>
                        <StyledTableCell align="right">
                          {getStatusChip(item.status, language)}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {item.status !== "Cancelled" && (
                            <Box display="flex" justifyContent="flex-end" gap={1}>
                              <MuiTooltip title={language === "العربية" ? "إلغاء الطلب" : "Cancel Order"}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  size="small"
                                  onClick={() => handleCancelOrder(order.id, item.id)}
                                  disabled={item.status === "Cancelled"}
                                  aria-label="cancel order"
                                  startIcon={<CancelIcon />}
                                >
                                  {language === "العربية" ? "إلغاء" : "Cancel"}
                                </Button>
                              </MuiTooltip>
                              <MuiTooltip title={language === "العربية" ? "حذف العنصر" : "Remove Item"}>
                                <Button
                                  variant="outlined"
                                  color="secondary"
                                  size="small"
                                  onClick={() => handleRemoveItem(order.id, item.id)}
                                  aria-label="remove item"
                                  startIcon={<DeleteIcon />}
                                >
                                  {language === "العربية" ? "حذف" : "Remove"}
                                </Button>
                              </MuiTooltip>
                            </Box>
                          )}
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
                        const originalStatus = getOriginalStatus(value);
                        return (
                          <span>
                            {STATUS_ICONS[originalStatus]} {value}
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
                  {language === "العربية" ? "نسبه الرضا عن المنتج" : "Product satisfaction rate"}
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default OrderTrackingPage;