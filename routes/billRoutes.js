const express = require("express");
const BillService = require("../services/bill-service");
const router = express.Router();

router.all("/init", async (req, res) => {
  const { servicename, payload } = req.body;
  const { service, bill_id, customer_id, company_id, from_date, to_date } =
    req.query;

  console.log("here ", customer_id);

  switch (req.method) {
    case "POST":
      if (servicename == "SETBILL") {
        try {
          const response = await BillService.setBill(payload);
          res.status(201).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal sever error";
          res.status(statusCode).json({ message });
        }
      }
      break;

    case "GET":
      if (service == "GETALLBILL") {
        try {
          const response = await BillService.getAllBill(company_id);
          res.status(200).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }

      if (service == "GETALLBILLCONDITIONED") {
        try {
          const response = await BillService.getAllBillConditioned(
            customer_id,
            company_id,
            from_date,
            to_date
          );
          res.status(200).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }

      if (service == "GETALLBILLITEMS") {
        try {
          const response = await BillService.getAllBillItems(
            bill_id,
            customer_id
          );
          res.status(200).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }

      if (service == "GETALLBILLPAYMENTHISTORY") {
        try {
          const response = await BillService.getAllBillPaymentHistory(
            bill_id,
            customer_id
          );
          res.status(200).json(response);
        } catch (error) {
          console.error(error);
          const statusCode = error.statusCode || 500;
          const message = error.message || "Internal server error";
          res.status(statusCode).json({ message });
        }
      }
      break;

    default:
      res.status(400).json({ message: "Method Not Allowed" });
      break;
  }
});

module.exports = router;
