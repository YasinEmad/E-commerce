import { Box, Grid, Card, CardMedia, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { motion } from "framer-motion";

export default function HeroSection() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        margin: "auto",
        padding: { xs: "10px", md: "20px" },
      }}
    >
      <Grid container spacing={2}>
        {/* Left Side - Slider */}
        <Grid item xs={12} md={8}>
          <Box sx={{ overflow: "hidden", borderRadius: "10px" }}>
            <Slider {...settings}>
              {/* First Slide */}
              <Card sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  sx={{ height: { xs: 250, md: 400 } }}
                  image="/images/gettyimages-1400453872-640x640.jpg"
                  alt="Slider Image 1"
                />
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "20px 25px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", fontSize: "22px" }}
                    >
                      Special Offer for You
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ fontSize: "16px", opacity: 0.9 }}
                    >
                      Get 50% Off on All Products
                    </Typography>
                  </Box>
                </motion.div>
              </Card>

              {/* Second Slide */}
              <Card sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  sx={{ height: { xs: 250, md: 400 } }}
                  image="/images/pexels-vlada-karpovich-8368049.jpg"
                  alt="Slider Image 2"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "30px",
                      left: "50px",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "18px" }}
                    >
                      Everything you need is here.
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "14px", opacity: 0.9 }}
                    >
                      What are you waiting for?
                    </Typography>
                  </Box>
                </motion.div>
              </Card>
              <Card sx={{ position: "relative" }}>
                <CardMedia
                  component="img"
                  sx={{ height: { xs: 250, md: 400 } }}
                  image="/images/White crown best gaming laptop.jfif"
                  alt="Slider Image 2"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "30px",
                      left: "50px",
                      background: "rgba(0, 0, 0, 0.7)",
                      color: "white",
                      padding: "12px 18px",
                      borderRadius: "10px",
                      textAlign: "center",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", fontSize: "18px" }}
                    >
                      New Collection
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontSize: "14px", opacity: 0.9 }}
                    >
                      Check out our latest arrivals
                    </Typography>
                  </Box>
                </motion.div>
              </Card>
            </Slider>
          </Box>
        </Grid>

        {/* Right Side - Two Stacked Images (Hidden on Small Screens) */}
        <Grid item xs={12} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Card>
              <motion.div whileHover={{ scale: 1.2 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 195 }}
                  image="/images/shoes.png"
                  alt="Top Image"
                />
              </motion.div>
            </Card>

            <Card>
              <motion.div whileHover={{ scale: 1.2 }}>
                <CardMedia
                  component="img"
                  sx={{ height: 195 }}
                  image="/images/dark-mode-black-late-night-work-inspiration.jpg"
                  alt="Bottom Image"
                />
              </motion.div>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
