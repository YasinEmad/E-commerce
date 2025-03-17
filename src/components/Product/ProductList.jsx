import PropTypes from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Container } from "@mui/material";
import ProductCard from "./ProductCard";
import { fetchProductsByCategory } from "../Redux/productsSlice";

const ProductList = ({ category }) => {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductsByCategory(category));
  }, [category, dispatch]);

  return (
    <Container sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
      {status === "loading" ? (
        <p>Loading...</p>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {items.map((product) => (
            <Grid
              item
              key={product.id}
              xs={12} 
              sm={6}   
              md={4}   
              lg={3}   
              xl={2}   
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

// تعريف PropTypes
ProductList.propTypes = {
  category: PropTypes.string.isRequired,
};

export default ProductList;
