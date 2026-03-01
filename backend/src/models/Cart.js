import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";
import Product from "./Product.js";

const Cart = sequelize.define("Cart", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  }
}, {
  tableName: "carts",
  timestamps: true
});

User.hasMany(Cart, { foreignKey: "user_id", onDelete: "CASCADE" });
Cart.belongsTo(User, { foreignKey: "user_id" });

Product.hasMany(Cart, { foreignKey: "product_id", onDelete: "CASCADE" });
Cart.belongsTo(Product, { foreignKey: "product_id" });

export default Cart;