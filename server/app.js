require("dotenv").config();

const express = require("express");
const app = express();
const connectDB = require("./db/connect");

const notFound = require("./middleware/not-found");
const cors = require("cors");
const auth = require("./routes/auth");
const profileRoute = require("./routes/profileRoute");
const passwordRoute = require("./routes/password");
const uploadCsv = require("./routes/uploadCsv");
const adminRoute = require("./routes/adminRoutes");
const path = require("path");
const errorHandler = require("./middleware/error-handler");
const port = process.env.PORT || 5000;
const axios = require("axios");


connectDB();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// app.use(express.static("public"));
app.use("/public", express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "50mb", extended: true }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.static("public"));

// Routes

app.use("/api/v1/auth", auth);
app.use("/api/v1/", passwordRoute);
app.use("/api/v1/profile", profileRoute);
app.use("/api/v1/", uploadCsv);
app.use("/api/v1/", adminRoute);
app.use(notFound);

app.use(express.static(path.resolve(__dirname, "../client/build")));

const start = async () => {
  try {
    await connectDB(process.env.URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

const WORDPRESS_API_URL = 'http://woocommerece-store.local/wp-json';
const WOOCOMMERCE_CONSUMER_KEY = 'ck_8bfa874fbf2c1550274aabdaa8535af245d4c858';
const WOOCOMMERCE_CONSUMER_SECRET = 'cs_24e678f3691aa3ab4b750ba214cfc9c2c80fe9fe';

const fetchData = async (endpoint, config = {}) => {
  try {
      const response = await axios.get(`${WORDPRESS_API_URL}/${endpoint}`, {
          ...config,
          auth: {
              username: WOOCOMMERCE_CONSUMER_KEY,
              password: WOOCOMMERCE_CONSUMER_SECRET,
          },
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          }
      });
      console.log('Data fetched successfully:', response.data);
      return response.data;
  } catch (error) {
      if (error.response) {
          // The request was made and the server responded with a status code
          console.error('Error status:', error.response.status);
          console.error('Error data:', error.response.data);
      } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
      } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
      }
      throw error;
  }
};

fetchData('wc/v3/products')
  .then(data => console.log('Products:', data))
  .catch(error => console.error('Error:', error));

// Example usage:

app.use(errorHandler);
start();
