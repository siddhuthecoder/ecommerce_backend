import express from "express";
import authenticate from "../Middleware/authentication.js";
import { addToCart, removeItem, viewCart } from "../Controllers/Cart.js";

const cartRouter = express.Router();

cartRouter.get("/", authenticate, viewCart);
cartRouter.post("/", authenticate, addToCart);
cartRouter.delete("/:productId", authenticate, removeItem);

export default cartRouter;
