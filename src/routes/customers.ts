import express from 'express';
import authMiddleware from '../../middleware/authmiddleware.js';
import adminMiddleware from "../../middleware/adminmiddleware.js";
import customerController from "../../controllers/customer/customerController.js";

const customerRouter = express.Router();

customerRouter.post("/", adminMiddleware, customerController.createCustomer);
customerRouter.get("/", authMiddleware, customerController.getCustomers);
customerRouter.get("/:id", authMiddleware, customerController.getCustomerById);
customerRouter.patch("/:id", adminMiddleware, customerController.updateCustomer);
customerRouter.delete("/:id", adminMiddleware, customerController.deleteCustomer);

export default customerRouter;
