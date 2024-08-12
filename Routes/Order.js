import express from "express";
import authenticate from "../Middleware/authentication.js";
import { placeOrder, getUserOrder, createOrder } from "../Controllers/Order.js";

const orderRouter = express.Router();

orderRouter.post("/", placeOrder);
orderRouter.get("/", getUserOrder);
orderRouter.post("/payment", createOrder);

export default orderRouter;
