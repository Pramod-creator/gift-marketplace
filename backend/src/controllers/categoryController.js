import Category from "../models/Category.js";
import slugify from "slugify";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const slug = slugify(name, { lower: true });

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [["name", "ASC"]]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.is_active = false;
    await category.save();

    res.json({ message: "Category removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};