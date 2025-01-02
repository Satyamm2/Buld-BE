const express = require("express");
const BlogPostService = require("../services/blogpost-service");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

// Apply the authenticateToken middleware to all routes within this router
// router.use(authenticateToken);

router.all("/init", async (req, res) => {
  switch (req.method) {
    case "POST":
      break;

    case "GET":
      const { service } = req.query;
      console.log("Service query:", service);

      // if (service == "GETBLOGPOST") {

      //   authenticateToken(req, res, async () => {
      //     try {
      //       const response = await BlogPostService.getBlogPost();
      //       res.status(200).json(response);
      //     } catch (error) {
      //       console.error("Error fetching blog post:", error);
      //       res.status(500).json({ message: "Internal server error." });
      //     }
      //   });
      // } else {
      //   res.status(400).json({ message: "Invalid service specified." });
      // }
      // }

      //** without authentication
      if (service == "GETBLOGPOST") {
        try {
          const response = await BlogPostService.getBlogPost();
          res.status(200).json(response);
        } catch (error) {
          console.error("Error fetching blog post:", error);
          res.status(500).json({ message: "Internal server error." });
        }
      } else {
        res.status(400).json({ message: "Invalid service specified." });
      }
      break;

    default:
      res.status(405).json({ message: "Method Not Allowed" });
      break;
  }
});

module.exports = router;
