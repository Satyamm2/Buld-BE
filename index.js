const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const blogpostApi = require("./routes/blogpost-api");
const customerRoutes = require("./routes/customerRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const billRoutes = require("./routes/billRoutes");
require("dotenv").config();

const app = express();

// Cors
app.use(cors());

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(express.json());

// Routes middleware
app.use("/api/auth", authRoutes);
app.use("/api/blogpost", blogpostApi);
app.use("/api/customer", customerRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/bill", billRoutes)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
