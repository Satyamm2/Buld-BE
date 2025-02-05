const fs = require("fs");
const { Pool } = require("pg");
require("dotenv").config();

// const sslCa = fs.readFileSync("./ca.pem");

// Creating the PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "buld_db",
  password: process.env.DB_PASSWORD || "admin123",
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUR48vlIio06EZL91pqHiZTnejw0QwDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvMDI0MWQ2ZGUtZGY0Yi00MDRhLTlkNDAtMjI3Zjg5OWJl
NzAxIFByb2plY3QgQ0EwHhcNMjUwMTAxMTg0OTU1WhcNMzQxMjMwMTg0OTU1WjA6
MTgwNgYDVQQDDC8wMjQxZDZkZS1kZjRiLTQwNGEtOWQ0MC0yMjdmODk5YmU3MDEg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBAI4epaD3
Xxv4JaAvvlx4mgDxS0c49LyOqqEJKyvFGeUxPN66UXvM13ieE+uLtf36b/oN/bZg
UBa6bI2fLW9twnxA8zErSSMvJHJngZLk2iipG5+I9+N5o4/H4geZ70RAiifC9YuK
QH6A5gjxE+odPWT2CW5gx/gV4fb+gbbI5t3e65v/7r/eU4IobUZf1U4iBxJ1Jwjf
2IZnCwQUx+vLyK5rvJ75r3dzgUHaMoYS+eTQ3hsmMIML3iCO9gRkAwlCi+YbOyzE
Pc/R1+fy7484A0gBMRN9PhG8MJJC/PTZYdLITnKUWcVXdNOiyG638sX17EIbYdkb
hMxy6a6n72bSVqex5pdZ16Yx9XQ3/5kmgJC7LAG7qK8awgAEYcRwkIgnXwHOp+79
xGwBItcR6OnA+pnGNFj6u2UvXqWOCEYdIhQZd2RtRsm/GrIWY+AcpSDCTdCVm6mm
vjmV6UGUsgyKuubc0PdFrDuMHrxQtifJUAy2Nfrnt7LEPXSW4yXP/KBofwIDAQAB
oz8wPTAdBgNVHQ4EFgQUKL7P0C4o+RpyqtdsmGw4k0HoEYkwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBABRUMM2W6p+Jcf9n
nlBKp6QGe6bI5vcaB//UukFupA4vU670VWkII5/pGor4yVnhmfoP/veLlpAr7VcT
fkOc2oao3MMl3QoOLOhSVeK4aB/ix4WDQVwSvzvrpbaQ7NsQnxlgulXDqUEvcv9M
jOvoxSfGe7Ze6+z4zWsVJJWWyHMDN1NmZReddQAKTq8aEkqyo29UAfS4LT/cWbRU
evx4KOyRYm+sXgiu7W8rMk0JL5SgzNjbZxV4bvTITJ+y+GWB1ic14hhmWrn6uf7J
H83s+ElKy2u//Kdid6F7tCbBYPVktEXEcIq9LW5MtEhcQA2ldJuURNx4XllPuLdd
sDu5MvO/OU4ZMMRBOt2H7cs2muBMFaLh5TQDz4+NoibQco5cJ4a3CZ6ioMHWFgF1
TkaJ/zHok7OaXJ5/Zji/NX/uwnj1DSrXvykh0QRuExorcBrNIArR8skPMo6Me2MR
bRmZnqJELAAOhcFnAwdycJn+j/g5IPhg26AwP7T007pQNOmU7Q==
-----END CERTIFICATE-----
`,
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
