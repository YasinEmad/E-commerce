import { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { addToCart } from '../Redux/cartSlice';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  // حساب السعر بعد الخصم
  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price.toFixed(2);

  const handleCartClick = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    Swal.fire({
      title: 'Success!',
      text: `${product.title} has been added to your cart.`,
      icon: 'success',
      timer: 1500,
      timerProgressBar: true,
      position: 'top-end',
      toast: true,
      showConfirmButton: false,
      customClass: {
        popup: 'small-swal',
      },
      willOpen: () => {
        document.querySelector('.swal2-container').style.zIndex = 2000;
      },
    });
  };

  return (
    <>
      <Card
        sx={{
          width: '100%',
          maxWidth: 345,
          mx: 'auto',
          position: 'relative',
          transition: 'transform 0.3s, box-shadow 0.3s',
          cursor: 'pointer',
          borderRadius: 2,
          boxShadow: 3,
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 10,
            '& .overlay': {
              opacity: 1,
            },
          },
        }}
        onClick={() => setOpen(true)}
      >
        {/* Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 2,
            opacity: 0,
            transition: 'opacity 0.3s',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          className="overlay"
        >
          <Typography variant="h6" color="white" fontWeight="bold">
            View Details
          </Typography>
        </Box>

        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="280"
            image={product.thumbnail} // استخدام thumbnail بدلًا من image
            alt={product.title}
            sx={{
              objectFit: 'cover',
              transition: 'transform 0.3s',
              '&:hover': { transform: 'scale(1.08)' },
            }}
          />
          {product.discountPercentage > 0 && ( // استخدام discountPercentage بدلًا من discount
            <Chip
              label={`-${product.discountPercentage}% OFF`} // عرض نسبة الخصم
              color="error"
              sx={{ position: 'absolute', top: 8, left: 8, fontWeight: 'bold', zIndex: 1 }}
            />
          )}
        </Box>
        <CardContent>
          <Typography variant="h6" noWrap sx={{ fontWeight: 'bold', mb: 1, textTransform: 'capitalize' }}>
            {product.title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
          >
            {product.description}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
              ${discountedPrice}
            </Typography>
            {product.discountPercentage > 0 && ( // استخدام discountPercentage بدلًا من discount
              <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            fullWidth
            startIcon={<ShoppingCartIcon />}
            onClick={handleCartClick}
            sx={{
              borderRadius: 2,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
            }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 'bold', textAlign: 'center' }}>{product.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'start', pt: 2 }}>
            <CardMedia
              component="img"
              image={product.thumbnail} // استخدام thumbnail بدلًا من image
              alt={product.title}
              sx={{
                width: '100%',
                height: 'auto',
                aspectRatio: '1/1',
                objectFit: 'cover',
                borderRadius: 1,
                boxShadow: 2,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
              }}
            />
            <Box>
              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${discountedPrice}
                </Typography>
                {product.discountPercentage > 0 && ( // استخدام discountPercentage بدلًا من discount
                  <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                    ${product.price.toFixed(2)}
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                fullWidth
                startIcon={<ShoppingCartIcon />}
                onClick={handleCartClick}
                sx={{
                  borderRadius: 2,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.05)', boxShadow: 5 },
                }}
              >
                Add to Cart
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    discountPercentage: PropTypes.number, // تغيير discount إلى discountPercentage
    thumbnail: PropTypes.string.isRequired, // تغيير image إلى thumbnail
    images: PropTypes.arrayOf(PropTypes.string), // إضافة images
  }).isRequired,
};

export default ProductCard;