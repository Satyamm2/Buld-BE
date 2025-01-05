const pool = require("../config/db");

const CustomerService = {
  setCustomer: async (payload) => {
    try {
      const query = `
          INSERT INTO customerinfo 
          (name, mobile_number, email, address, company_id) 
          VALUES 
          ($1, $2, $3, $4, $5)
          RETURNING id
        `;

      const value = [
        payload.name,
        payload.mobile_number,
        payload.email,
        payload.address,
        payload.company_id,
      ];

      const result = await pool.query(query, value);
      return result;
    } catch (error) {
      console.error(error);
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },

  updateCustomer: async (payload) => {
    try {
      const query = `
          UPDATE customerinfo SET
          mobile_number = $1,
          email = $2,
      address = $3,
    updated_at = now()
  WHERE 
    id = $4 AND
    company_id = $5
        `;

      const value = [
        payload.mobile_number,
        payload.email,
        payload.address,
        payload.customer_id,
        payload.company_id,
      ];

      const result = await pool.query(query, value);
      return result;
    } catch (error) {
      console.error(error);
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },

  getCustomer: async (company_id) => {
    try {
      const query = `SELECT * from customerinfo where company_id=$1`;
      const value = [company_id];
      const result = await pool.query(query, value);
      return result;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },

  deleteCustomer: async (company_iddel, customer_iddel) => {
    try {
      const query = `DELETE FROM customerinfo WHERE id=$1 AND company_id=$2 `;
      const value = [customer_iddel, company_iddel];
      const result = await pool.query(query, value);
      return result;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },
};

module.exports = CustomerService;
