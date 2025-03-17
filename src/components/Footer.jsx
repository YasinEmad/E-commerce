import { Container, Typography, Box, IconButton, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ marginTop: "auto" }} // Ensure footer stays at bottom
    >
      <Box 
        sx={{ 
          bgcolor: theme.palette.background.default, 
          color: theme.palette.text.primary, 
          py: 2, 
          px: 4, 
          borderTop: "3px solid #023047" 
        }}
      >
        <Container>
          <Grid container alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                &copy; {new Date().getFullYear()} Creative Life. All rights reserved.
              </Typography>
            </Grid>
            <Grid item>
              <Box>
                {[Facebook, Twitter, Instagram, LinkedIn].map((Icon, index) => (
                  <motion.div whileHover={{ scale: 1.2 }} key={index} style={{ display: "inline-block", marginLeft: "8px" }}>
                    <IconButton sx={{ color: "#658dae" }}> {/* Updated color here */}
                      <Icon fontSize="medium" />
                    </IconButton>
                  </motion.div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </motion.footer>
  );
};

export default Footer;