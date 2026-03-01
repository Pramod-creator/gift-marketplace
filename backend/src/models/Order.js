import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const Order = sequelize.define("Order", {
  total_price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "shipped", "completed", "cancelled"),
    defaultValue: "pending"
  }
}, {
  tableName: "orders",
  timestamps: true
});

User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

export default Order;