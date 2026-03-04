import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity or product" });
    }

    const product = await Product.findByPk(product_id);

    if (!product || !product.is_active) {
      return res.status(404).json({ message: "Product unavailable" });
    }

    // Prevent seller adding own product
    if (product.seller_id === req.user.id) {
      return res.status(403).json({ message: "Cannot buy your own product" });
    }

    const existing = await Cart.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      user_id: req.user.id,
      product_id,
      quantity
    });

    res.status(201).json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Product }]
    });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity or product" });
    }

    const existing = await Cart.findOne({
      where: { user_id: req.user.id, product_id }
    });

    if (!existing) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    existing.quantity = Number(quantity);
    await existing.save();

    res.json(existing);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    await Cart.destroy({
      where: { id: req.params.id, user_id: req.user.id }
    });

    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};