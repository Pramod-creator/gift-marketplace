import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";
import sequelize from "../config/database.js";

export const checkout = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [Product],
      transaction: t
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let total = 0;

    cartItems.forEach(i => {
      total += i.quantity * parseFloat(i.Product.price);
    });

    const order = await Order.create(
      { user_id: req.user.id, total_price: total },
      { transaction: t }
    );

    for (const item of cartItems) {
      await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.Product.price
      }, { transaction: t });
    }

    await Cart.destroy({ where: { user_id: req.user.id }, transaction: t });

    await t.commit();
    res.status(201).json(order);

  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: "Checkout failed" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product, attributes: ["id", "name", "price", "image_url"] }]
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