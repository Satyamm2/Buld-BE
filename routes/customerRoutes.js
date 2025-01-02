const express = require("express");
const CustomerService = require("../services/customer-service");
const router = express.Router();

router.all("/init", async (req, res) => {
  switch (req.method) {
    case "POST":
      const { servicePost, payload } = req.body;
      if (servicePost == "ADDCUS") {
        try {
          const response = await CustomerService.setCustomer(payload);
          res.status(201).json(response);
        } catch (error) {
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }
      break;

    case "PUT":
      const { servicePut, payloadPut } = req.body;
      if (servicePut == "UPDATECUS") {
        try {
          const response = await CustomerService.updateCustomer(payloadPut);
          res.status(200).json(response);
        } catch (error) {
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }
      break;

    case "GET":
      const { service, company_id } = req.query;

      if (service == "GETCUS") {
        try {
          const response = await CustomerService.getCustomer(company_id);
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
      const { servicedel, company_iddel, customer_iddel } = req.query;

      if (servicedel == "DELETECUS") {
        try {
          const response = await CustomerService.deleteCustomer(
            company_iddel,
            customer_iddel
          );
          res.status(200).json({ message: "Customer deleted successfully" });
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
