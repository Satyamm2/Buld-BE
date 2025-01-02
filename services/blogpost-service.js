const pool = require("../config/db");

const BlogPostService = {
  getBlogPost: async () => {
    try {
      const query = `SELECT * from posts`;
      const result = await pool.query(query);
      return result;
    } catch (error) {
      throw new Error("Error if fetching data");
    }
  },
};

module.exports = BlogPostService;
