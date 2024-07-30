import Order from "../Models/Orders.js";
import instance from "../razorpayInstance.js";
import crypto from "crypto";

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      products,
      totalPrice,
      razorpay_payment_id,
      order_id,
      razorpay_signature,
    } = req.body;

    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET_KEY);
    hmac.update(order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    const isAuth = generated_signature === razorpay_signature;
    if (isAuth) {
      const order = await Order.create({
        userId,
        products,
        totalPrice,
        razorpay_order_id: order_id,
      });

      const populatedOrder = await Order.findById(order._id).populate({
        path: "products.productId",
        select: "name price image description",
      });

      return res.status(200).json({ order, message: "Order Successful" });
    } else {
      return res.status(400).json({
        message: "Payment Failed Due to Signature not matched",
        success: false,
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUserOrder = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate({
        path: "products.productId",
        select: "name price image description",
      })
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOrder = async (req, res) => {
  const { totalPrice } = req.body;

  try {
    const order = await instance.orders.create({
      amount: Number(totalPrice * 100), // in Paises
      currency: "INR",
    });

    if (!order.id) {
      return res.status(200).send({ status: "Failure" });
    }
    return res.status(200).send({ order, status: "Success" });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
