const Category = require("../models/category");
const {getModelCount} = require ('../helpers/count')



const getCategoriesCount = getModelCount(Category)
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    if (categories) return res.status(200).json(categories);
    res.status(404).json({ succes: false, massege: "Categories not found !" });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getOneCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (category) return res.status(200).json(category);
    return res
      .status(404)
      .json({ success: false, message: "Category not found !" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found with id " + req.params.categoryId,
      });
    }
    res.status(500).json({
      success: false,
      message: "Could not delete Category with id " + req.params.categoryId,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const category = new Category({
      name,
      icon,
      color,
    });
    const newCategory = await category.save();
    res.status(200).json(newCategory);
  } catch (err) {
    if (err.message) return res.status(400).json({ message: err.message });

    res
      .status(400)
      .json({ message: "Some error occurred while creating the category." });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, icon, color } = req.body;
    const categoryUpdated = await Category.findByIdAndUpdate(
      req.params.categoryId,
      { name, icon, color },
      { new: true } // to return new data which updated
    );
    if (!categoryUpdated) {
      return res.status(404).send({
        message: "Category not found with id " + req.params.categoryId,
      });
    }
    res.json(categoryUpdated);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found with id " + req.params.categoryId,
      });
    }
    return res.status(500).send({
      message: "Error updating category with id " + req.params.categoryId,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const categoryDeleted = await Category.findByIdAndRemove(
      req.params.categoryId
    );
    if (categoryDeleted)
      return res.status(200).json({
        success: true,
        message: "Category is deleted with id :  " + req.params.categoryId,
      });
    return res
      .status(404)
      .json({ success: false, message: "Category not found !" });
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found with id " + req.params.categoryId,
      });
    }
    res.status(500).json({
      success: false,
      message: "Could not delete Category with id " + req.params.categoryId,
    });
  }
};
module.exports = {
  getAllCategories,
  getOneCategory,
  getCategoriesCount,
  createCategory,
  updateCategory,
  deleteCategory,

};
