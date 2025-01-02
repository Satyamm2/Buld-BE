const fs = require("fs");
const { Pool } = require("pg");
require("dotenv").config();

const sslCa = fs.readFileSync("./ca.pem");

// Creating the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "buld_db",
  password: process.env.DB_PASSWORD || "admin123",
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: sslCa.toString(),
  },
});

// Logging when a client is connected
pool.on("connect", () => {
  console.log("Connected to PostgreSQL database");
});

// Logging errors in the pool
pool.on("error", (err) => {
  console.error("Error with PostgreSQL connection", err);
});

module.exports = pool;
