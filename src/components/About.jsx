import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Container,
} from "@mui/material";
import { motion } from "framer-motion";
import PeopleIcon from "@mui/icons-material/People";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@mui/material";

const About = () => {
  const theme = useTheme();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  // Get the selected language from Redux
  const language = useSelector((state) => state.language.language);

  // Translations for sections
  const sections = {
    English: [
      {
        icon: <PeopleIcon fontSize="large" style={{ color: "#4CAF50" }} />,
        title: "Our Team",
        text: "We have a skilled and dedicated team that works tirelessly to deliver exceptional results.",
      },
      {
        icon: <LightbulbIcon fontSize="large" style={{ color: "#FFC107" }} />,
        title: "Our Vision",
        text: "Our vision is to innovate and inspire. We aim to create solutions that exceed expectations.",
      },
      {
        icon: <RocketLaunchIcon fontSize="large" style={{ color: "#2196F3" }} />,
        title: "Our Mission",
        text: "Our mission is to deliver excellence in every project. We are committed to providing high-quality services.",
      },
      {
        icon: <PeopleIcon fontSize="large" style={{ color: "#9C27B0" }} />,
        title: "Our Values",
        text: "We value integrity, innovation, and customer satisfaction. These principles guide everything we do.",
      },
    ],
    العربية: [
      {
        icon: <PeopleIcon fontSize="large" style={{ color: "#4CAF50" }} />,
        title: "فريقنا",
        text: "لدينا فريق ماهر ومكرس يعمل بلا كلل لتقديم نتائج استثنائية.",
      },
      {
        icon: <LightbulbIcon fontSize="large" style={{ color: "#FFC107" }} />,
        title: "رؤيتنا",
        text: "رؤيتنا هي الابتكار والإلهام. نهدف إلى إنشاء حلول تتجاوز التوقعات.",
      },
      {
        icon: <RocketLaunchIcon fontSize="large" style={{ color: "#2196F3" }} />,
        title: "رسالتنا",
        text: "رسالتنا هي تقديم التميز في كل مشروع. نحن ملتزمون بتقديم خدمات عالية الجودة.",
      },
      {
        icon: <PeopleIcon fontSize="large" style={{ color: "#9C27B0" }} />,
        title: "قيمنا",
        text: "نقدر النزاهة والابتكار ورضا العملاء. هذه المبادئ توجه كل ما نقوم به.",
      },
    ],
  };

  // Translations for values
  const values = {
    English: ["Commitment to Quality", "Customer Satisfaction", "Innovative Solutions"],
    العربية: ["الالتزام بالجودة", "رضا العملاء", "حلول ابتكارية"],
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
          py: 8,
          mt: "64px", // Match header height
        }}
      >
        <Container maxWidth="lg" ref={ref}>
          <Grid container spacing={6}>
            {/* First Card and Image */}
            <Grid item xs={12} md={6}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                sx={{
                  mb: 4,
                  boxShadow: theme.shadows[4],
                  borderRadius: "16px",
                  padding: "16px",
                  marginTop: "40px",
                  height: "160px",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {sections[language][0].icon}
                  </motion.div>
                  <div>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                        mb: 1,
                      }}
                    >
                      {sections[language][0].title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {sections[language][0].text}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>

            {/* First Image */}
            <Grid item xs={12} md={6}>
              <motion.img
                src="/images/Ecommerce web page-pana.svg"
                alt="About Us"
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                style={{
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: "450px",
                  marginLeft: isSmallScreen ? "0px" : "80px",
                }}
              />
            </Grid>

            {/* Second Image */}
            <Grid item xs={12} md={4}>
              <motion.img
                src="/public/images/cria.png" // Replace with your image path
                alt="Team Collaboration"
                initial={{ opacity: 0, x: -50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                style={{
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: "300px",
                  marginTop: isSmallScreen ? "20px" : "0px",
                  objectFit: "cover",
                  display: isSmallScreen ? "none" : "block",
                }}
              />
            </Grid>

            {/* Second Card */}
            <Grid item xs={12} md={8}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5 }}
                sx={{
                  mb: 4,
                  boxShadow: theme.shadows[4],
                  borderRadius: "16px",
                  padding: "16px",
                  marginTop: isSmallScreen ? "20px" : "40px",
                  height: "160px",
                  border: `1px solid ${theme.palette.divider}`,
                  "&:hover": {
                    boxShadow: theme.shadows[8],
                  },
                }}
              >
                <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {sections[language][1].icon}
                  </motion.div>
                  <div>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                        mb: 1,
                      }}
                    >
                      {sections[language][1].title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        lineHeight: 1.6,
                      }}
                    >
                      {sections[language][1].text}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            </Grid>

            {/* Other Cards */}
            <Grid item xs={12}>
              {sections[language].slice(2).map((section, index) => (
                <Card
                  key={index}
                  component={motion.div}
                  initial={{ opacity: 0, y: 50 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  sx={{
                    mb: 4,
                    boxShadow: theme.shadows[4],
                    borderRadius: "16px",
                    padding: "16px",
                    border: `1px solid ${theme.palette.divider}`,
                    "&:hover": {
                      boxShadow: theme.shadows[8],
                    },
                  }}
                >
                  <CardContent sx={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      {section.icon}
                    </motion.div>
                    <div>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: "bold",
                          color: theme.palette.text.primary,
                          mb: 1,
                        }}
                      >
                        {section.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: theme.palette.text.secondary,
                          lineHeight: 1.6,
                        }}
                      >
                        {section.text}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </Grid>

            {/* Values Section */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: "center",
                  gap: 4,
                  mt: 6,
                }}
              >
                {values[language].map((title, index) => (
                  <Card
                    key={index}
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    sx={{
                      flex: 1,
                      maxWidth: { xs: "100%", md: "400px" },
                      p: 4,
                      boxShadow: theme.shadows[4],
                      borderRadius: "16px",
                      backgroundColor: theme.palette.background.paper,
                      "&:hover": {
                        boxShadow: theme.shadows[8],
                      },
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        mb: 2,
                        textAlign: "center",
                        color: theme.palette.primary.main,
                      }}
                    >
                      {title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text.secondary,
                        textAlign: "center",
                        lineHeight: 1.6,
                      }}
                    >
                      {language === "English"
                        ? "We continuously strive to ensure that our products and services exceed expectations by delivering groundbreaking results."
                        : "نسعى باستمرار لضمان أن منتجاتنا وخدماتنا تتجاوز التوقعات من خلال تقديم نتائج ثورية."}
                    </Typography>
                  </Card>
                ))}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default About;