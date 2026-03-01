import User from "../models/User.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "is_active", "createdAt"],
      order: [["createdAt", "DESC"]]
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.is_active = !user.is_active;
    await user.save();

    res.json({
      message: `User ${user.is_active ? "activated" : "blocked"}`,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: ["id", "name", "email"] },
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "price"] }]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const adminDeactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.is_active = false;
    await product.save();

    res.json({ message: "Product deactivated by admin" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};