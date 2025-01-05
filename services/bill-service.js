const pool = require("../config/db");
const CustomerService = require("./customer-service");

const BillService = {
  setBill: async (payload) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      let customerId = null;

      if (payload.new_customer) {
        payload.new_customer.company_id = payload.company_id;
        payload.new_customer.user_id = payload.user_id;
        const customer = await CustomerService.setCustomer(
          payload.new_customer
        );

        if (!customer.rows || customer.rows.length === 0) {
          throw new Error("Failed to create customer", 400);
        }

        customerId = customer.rows[0].id;
      }

      const finalCustomerId = customerId || payload.customer_id;

      const bill = await pool.query(
        `INSERT INTO bill 
        (bill_no, customer_id, company_id, user_id, remarks, total_amount, delivery_charges, net_amount, total_discount) VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id
        `,
        [
          payload.bill_no,
          finalCustomerId,
          payload.company_id,
          payload.user_id,
          payload.remarks,
          payload.total_amount,
          payload.delivery_charges,
          payload.net_amount,
          payload.total_discount,
        ]
      );

      const bill_id = bill.rows[0].id;

      if (!bill_id) {
        throw new Error("Bill creation failed", 400);
      }

      const billItemsData = payload.lineData.map((item) => [
        bill_id,
        finalCustomerId,
        item.item_id,
        item.item_name,
        item.item_description || "",
        item.rate,
        item.quantity,
        item.total,
      ]);

      if (billItemsData.length > 0) {
        const placeholders = billItemsData
          .map(
            (_, index) =>
              `($${index * 8 + 1}, $${index * 8 + 2}, $${index * 8 + 3}, $${
                index * 8 + 4
              }, $${index * 8 + 5}, $${index * 8 + 6}, $${index * 8 + 7}, $${
                index * 8 + 8
              })`
          )
          .join(", ");

        const billItemsQuery = `
           INSERT INTO bill_items 
          (bill_id, customer_id, item_id, item_name, item_description, rate, quantity, total) 
          VALUES 
          ${placeholders}
        `;

        const flatValues = billItemsData.flat();

        await pool.query(billItemsQuery, flatValues);
      }

      const bill_payment_history = await pool.query(
        `
        INSERT INTO bill_payment_history 
        (bill_id, customer_id, payment_amount, balance) VALUES
        ($1, $2, $3, $4)
        RETURNING id
        `,
        [bill_id, finalCustomerId, payload.payment_amount, payload.balance]
      );

      const existingBillBalance = await pool.query(
        `SELECT id FROM bill_balance WHERE bill_id = $1 AND customer_id = $2`,
        [bill_id, finalCustomerId]
      );

      if (existingBillBalance.rows.length > 0) {
        const updateQuery = `
          UPDATE bill_balance 
          SET balance = $1, updated_at = CURRENT_TIMESTAMP 
          WHERE bill_id = $2 AND customer_id = $3
        `;
        await pool.query(updateQuery, [
          payload.balance,
          bill_id,
          finalCustomerId,
        ]);
      } else {
        await pool.query(
          `INSERT INTO bill_balance
             (bill_id, customer_id, balance)
             VALUES ($1, $2, $3)
            `,
          [bill_id, finalCustomerId, payload.balance]
        );
      }

      await client.query("COMMIT");
      return { status: 201, data: bill_id };
    } catch (error) {
      await client.query("ROLLBACK");
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    } finally {
      client.release();
    }
  },

  getAllBill: async (company_id) => {
    try {
      const query = `
        SELECT 
          bill.*, 
          customerinfo.name AS customer_name,
          bill_balance.balance
        FROM 
          bill 
        JOIN
          customerinfo ON bill.customer_id = customerinfo.id
        LEFT JOIN
          bill_balance ON bill.id = bill_balance.bill_id
          AND bill.customer_id = bill_balance.customer_id
        WHERE 
          bill.company_id=$1
        ORDER BY
          bill.created_at DESC
      `;
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

  getAllBillConditioned: async (
    customer_id,
    company_id,
    from_date,
    to_date
  ) => {
    console.log("customer_id", customer_id);
    console.log("from", from_date);
    console.log("to", to_date);
    try {
      let query = `
      SELECT 
          bill.*, 
          customerinfo.name AS customer_name,
          bill_balance.balance
        FROM 
          bill 
        JOIN
          customerinfo ON bill.customer_id = customerinfo.id
        LEFT JOIN
          bill_balance ON bill.id = bill_balance.bill_id
          AND bill.customer_id = bill_balance.customer_id
        WHERE 
          bill.company_id=$1
       `;
      const values = [company_id];

      let conditionIndex = 2;

      if (customer_id) {
        query += ` AND bill.customer_id=$${conditionIndex}`;
        values.push(customer_id);
        conditionIndex++;
      }

      if (from_date) {
        query += ` AND DATE(bill.created_at) >= $${conditionIndex}`;
        values.push(from_date);
        conditionIndex++;
      }

      if (to_date) {
        query += ` AND DATE(bill.created_at) <= $${conditionIndex}`;
        values.push(to_date);
        conditionIndex++;
      }

      query += ` ORDER BY bill.created_at DESC`;

      console.log("query==>", query);

      const result = await pool.query(query, values);
      return result;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },

  getAllBillItems: async (bill_id, customer_id) => {
    try {
      const query = `SELECT * from bill_items where bill_id=$1 and customer_id=$2`;
      const value = [bill_id, customer_id];
      const result = await pool.query(query, value);
      return result;
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },

  getAllBillPaymentHistory: async (bill_id, customer_id) => {
    try {
      const query = `SELECT * from bill_payment_history where bill_id=$1 and customer_id=$2 ORDER BY
          created_at DESC`;
      const value = [bill_id, customer_id];
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

module.exports = BillService;
