const express = require("express");
const ItemsService = require("../services/items-service");
const router = express.Router();

router.all("/init", async (req, res) => {
  const { servicename, payload } = req.body;
  const { service, company_id, user_id, item_id } = req.query;

  switch (req.method) {
    case "POST":
      if (servicename == "ADDITEMS") {
        try {
          const response = await ItemsService.setItems(payload);
          res.status(201).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }
      break;

    case "PUT":
      if (servicename == "UPDATEITEMS") {
        try {
          const response = await ItemsService.updateItems(payload);
          res.status(200).json(response);
        } catch (error) {
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }
      break;

    case "GET":
      if (service == "GETITEMS") {
        try {
          const response = await ItemsService.getItems(company_id);
          res.status(200).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      } else {
        res.status(400).json({ message: "Invalid service specified." });
      }
      break;

    case "DELETE":
      if (service == "DELETEITEMS") {
        try {
          const response = await ItemsService.deleteItem(
            company_id,
            user_id,
            item_id
          );
          res.status(200).json({ message: "Item Deleted successfully" });
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
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
