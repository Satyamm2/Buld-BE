const pool = require("../config/db");

const ItemsService = {
  setItems: async (payloadArray) => {
    try {
      const query = `
          INSERT INTO items 
          (item_name, item_description, company_id, user_id) 
          VALUES 
          ($1, $2, $3, $4);

        `;

      await pool.query("BEGIN");

      for (const payload of payloadArray) {
        const values = [
          payload.itemname,
          payload.item_description,
          payload.company_id,
          payload.user_id,
        ];
        await pool.query(query, values);
      }

      await pool.query("COMMIT");

      return { message: "All items inserted successfully." };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  },

  updateItems: async (payload) => {
    try {
      const query = `
          UPDATE items SET
          item_description = $1
  WHERE 
    id = $2 AND
    user_id = $3
        `;

      const value = [payload.item_description, payload.id, payload.user_id];

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

  getItems: async (company_id) => {
    try {
      const query = `SELECT * from items where company_id=$1`;
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

  deleteItem: async (company_id, user_id, item_id) => {
    try {
      const query = `DELETE FROM items WHERE company_id=$1 AND user_id=$2 AND id=$3`;
      const value = [company_id, user_id, item_id];
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

module.exports = ItemsService;
