const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const registerUser = async (payload) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const existingUser = await pool.query(
      "SELECT * from users WHERE username = $1 OR mobile_number = $2 OR email = $3",
      [payload.username, payload.mobileNumber, payload.email]
    );

    if (existingUser.rowCount > 0) {
      await client.query("ROLLBACK");

      if (
        existingUser.username == payload.username &&
        existingUser.email == payload.email &&
        existingUser.mobile_number == payload.mobileNumber
      ) {
        const error = new Error(
          "Username, email or mobile_number already exist!"
        );
        error.statusCode = 409;
        throw error;
      }

      if (existingUser.username || payload.username) {
        const error = new Error("Username already exist!");
        error.statusCode = 409;
        throw error;
      }
      if (existingUser.email == payload.email) {
        const error = new Error("Email already exist!");
        error.statusCode = 409;
        throw error;
      }
      if (existingUser.mobile_number == payload.mobileNumber) {
        const error = new Error("Mobile number already exist!");
        error.statusCode = 409;
        throw error;
      }
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);

    const companyResult = await client.query(
      `INSERT INTO companyinfo (company_name, company_reg_no) 
       VALUES ($1, $2) RETURNING id`,
      [payload.companyName, payload.comp_reg_no]
    );

    const companyId = companyResult.rows[0].id;

    if (!companyId) {
      await client.query("ROLLBACK");
      const error = new Error("Registration failed: company ID not found");
      error.statusCode = 400;
      throw error;
    }

    const userResult = await pool.query(
      `INSERT INTO users 
          (username, first_name, last_name, email, mobile_number, password, company_id)
          VALUES
          ($1, $2, $3, $4, $5, $6, $7) RETURNING id
      `,
      [
        payload.username,
        payload.firstName,
        payload.lastName,
        payload.email,
        payload.mobileNumber,
        hashedPassword,
        companyId,
      ]
    );
    await client.query("COMMIT");
    return { status: 201, data: userResult.rows[0] };
  } catch (error) {
    await client.query("ROLLBACK");
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  } finally {
    client.release();
  }
};

const authenticateUser = async (email, password) => {
  const query = "SELECT * FROM users WHERE email = $1";
  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 401;
    throw error;
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const company_id = result.rows[0].company_id;

  const companyResult = await pool.query(
    "SELECT * FROM companyinfo WHERE id = $1",
    [company_id]
  );

  const companyInfo = companyResult.rows[0];

  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const sessionData = {
    user: {
      id: user.id,
      username: user.username,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      mobile_number: user.mobile_number,
      user_role: user.user_role,
      company_id: user.company_id,
      created_at: user.created_at,
    },
    company: companyInfo,
  };

  return { token, sessionData };
};

module.exports = { registerUser, authenticateUser };
