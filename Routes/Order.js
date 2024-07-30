import express from "express";
import authenticate from "../Middleware/authentication.js";
import { placeOrder, getUserOrder, createOrder } from "../Controllers/Order.js";

const orderRouter = express.Router();

orderRouter.post("/", authenticate, placeOrder);
orderRouter.get("/", authenticate, getUserOrder);
orderRouter.post("/payment", authenticate, createOrder);

export default orderRouter;
